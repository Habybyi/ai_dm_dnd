import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

// ─── GET /dashboard stats ─────────────────────────────────────────────────────
export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const campaigns = await Campaign.find({ "members.userId": userId });

        const formattedCampaigns = campaigns.map(c => {
            const memberInfo = c.members.find(m => m.userId.toString() === userId);
            return {
                _id: c._id,
                name: c.name,
                image: c.campaignAvatar,
                role: memberInfo ? memberInfo.role : 'Unknown',
                status: c.status,
                playerCount: c.members.length,
                inviteCode: c.inviteCode
            };
        });

        res.status(200).json({
            success: true,
            user: { username: user.username, email: user.email },
            campaigns: formattedCampaigns,
            stats: { totalCampaigns: campaigns.length }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// ─── POST /campaigns ──────────────────────────────────────────────────────────
export const createCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            description,
            status,
            campaignAvatar,
            aiLoreContext,
            sessionSummary,
            inviteCode,
            maps,
            handouts,
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Názov kampane je povinný." });
        }

        if (!inviteCode) {
            return res.status(400).json({ message: "Invite kód je povinný." });
        }

        const existing = await Campaign.findOne({ inviteCode });
        if (existing) {
            return res.status(409).json({ message: "Invite kód je už použitý." });
        }

        const campaign = await Campaign.create({
            name,
            description,
            status: status || 'active',
            campaignAvatar,
            aiLoreContext,
            sessionSummary,
            inviteCode,
            ownerId: userId,
            maps: maps || [],
            handouts: handouts || [],
            members: [{ userId, role: 'DM' }],
        });

        await User.findByIdAndUpdate(userId, {
            $push: { campaigns: campaign._id }
        });

        res.status(201).json({ success: true, campaign });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri vytváraní kampane.", error: error.message });
    }
};

// ─── GET /campaigns/:id ───────────────────────────────────────────────────────
export const getCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň nebola nájdená." });
        }

        const isMember = campaign.members.some(m => m.userId.toString() === userId);
        if (!isMember) {
            return res.status(403).json({ message: "Nemáš prístup k tejto kampani." });
        }
        console.log("campaign")
        console.log(campaign)
        res.status(200).json({ success: true, campaign });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri načítaní kampane.", error: error.message });
    }
};

// ─── PUT /campaigns/:id ───────────────────────────────────────────────────────
export const updateCampaign = async (req, res) => {
    //console.log(req.body)
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň nebola nájdená." });
        }

        // Iba owner alebo DM môže editovať
        const member = campaign.members.find(m => m.userId.toString() === userId);
        const isDM = member?.role === 'DM';
        const isOwner = campaign.ownerId.toString() === userId;

        if (!isOwner && !isDM) {
            return res.status(403).json({ message: "Nemáš oprávnenie editovať túto kampaň." });
        }

        const {
            name,
            description,
            status,
            campaignAvatar,
            aiLoreContext,
            sessionSummary,
            maps,
            handouts,
            initiativeOrder,
            activeTokens,
            gameLog,
            members,
            generatedLocations,
        } = req.body;

        const updateFields = {};

        if (name               !== undefined) updateFields.name               = name;
        if (description        !== undefined) updateFields.description        = description;
        if (status             !== undefined) updateFields.status             = status;
        if (campaignAvatar     !== undefined) updateFields.campaignAvatar     = campaignAvatar;
        if (aiLoreContext      !== undefined) updateFields.aiLoreContext      = aiLoreContext;
        if (sessionSummary     !== undefined) updateFields.sessionSummary     = sessionSummary;
        if (maps               !== undefined) updateFields.maps               = maps;
        if (handouts           !== undefined) updateFields.handouts           = handouts;
        if (initiativeOrder    !== undefined) updateFields.initiativeOrder    = initiativeOrder;
        if (activeTokens       !== undefined) updateFields.activeTokens       = activeTokens;
        if (gameLog            !== undefined) updateFields.gameLog            = gameLog;
        if (members            !== undefined) updateFields.members            = members;
        if (generatedLocations !== undefined) updateFields.generatedLocations = generatedLocations;


        const updated = await Campaign.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { returnDocument: 'after', runValidators: true }
        );


        res.status(200).json({ success: true, campaign: updated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri ukladaní kampane.", error: error.message });
    }
};

// ─── DELETE /campaigns/:id ────────────────────────────────────────────────────
export const deleteCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň nebola nájdená." });
        }

        if (campaign.ownerId.toString() !== userId) {
            return res.status(403).json({ message: "Iba vlastník môže zmazať kampaň." });
        }

        await Campaign.findByIdAndDelete(id);

        // Odstráň z user.campaigns u všetkých členov
        const memberIds = campaign.members.map(m => m.userId);
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $pull: { campaigns: campaign._id } }
        );

        res.status(200).json({ success: true, message: "Kampaň bola zmazaná." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri mazaní kampane.", error: error.message });
    }
};

// ─── POST /campaigns/join ─────────────────────────────────────────────────────
export const joinCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { inviteCode } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ message: "Invite kód je povinný." });
        }

        const campaign = await Campaign.findOne({ inviteCode });
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň s týmto kódom neexistuje." });
        }

        const alreadyMember = campaign.members.some(m => m.userId.toString() === userId);
        if (alreadyMember) {
            return res.status(409).json({ message: "Už si členom tejto kampane." });
        }

        if (campaign.status === 'archived') {
            return res.status(400).json({ message: "Táto kampaň je archivovaná." });
        }

        campaign.members.push({ userId, role: 'Player' });
        await campaign.save();

        await User.findByIdAndUpdate(userId, {
            $push: { campaigns: campaign._id }
        });

        res.status(200).json({ success: true, campaign });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri pripájaní do kampane.", error: error.message });
    }
};

// ─── DELETE /campaigns/:id/leave ──────────────────────────────────────────────
export const leaveCampaign = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň nebola nájdená." });
        }

        if (campaign.ownerId.toString() === userId) {
            return res.status(400).json({ message: "Vlastník nemôže opustiť kampaň. Najprv ju zmaž alebo preveď vlastníctvo." });
        }

        const isMember = campaign.members.some(m => m.userId.toString() === userId);
        if (!isMember) {
            return res.status(400).json({ message: "Nie si členom tejto kampane." });
        }

        campaign.members = campaign.members.filter(m => m.userId.toString() !== userId);
        await campaign.save();

        await User.findByIdAndUpdate(userId, {
            $pull: { campaigns: campaign._id }
        });

        res.status(200).json({ success: true, message: "Opustil si kampaň." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri opúšťaní kampane.", error: error.message });
    }
};

// ─── PATCH /campaigns/:id/members/:memberId ───────────────────────────────────
export const updateMemberRole = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, memberId } = req.params;
        const { role, characterId } = req.body;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: "Kampaň nebola nájdená." });
        }

        const requester = campaign.members.find(m => m.userId.toString() === userId);
        const isDM = requester?.role === 'DM';
        const isOwner = campaign.ownerId.toString() === userId;

        if (!isOwner && !isDM) {
            return res.status(403).json({ message: "Nemáš oprávnenie meniť roly členov." });
        }

        const member = campaign.members.find(m => m._id.toString() === memberId);
        if (!member) {
            return res.status(404).json({ message: "Člen nebol nájdený." });
        }

        if (role)        member.role        = role;
        if (characterId) member.characterId = characterId;

        await campaign.save();

        res.status(200).json({ success: true, campaign });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri zmene roly.", error: error.message });
    }
};