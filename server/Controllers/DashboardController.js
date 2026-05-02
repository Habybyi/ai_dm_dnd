import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Hľadáme kampane kde je user členom
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
        console.log(error);
        res.status(500).json({ message: "Error", error: error.message });
    }
};

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

        // Skontroluj či invite kód nie je už obsadený
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
            members: [
                {
                    userId,
                    role: 'DM',
                }
            ],
        });

        // Pridaj kampaň do user.campaigns
        await User.findByIdAndUpdate(userId, {
            $push: { campaigns: campaign._id }
        });

        res.status(201).json({ success: true, campaign });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chyba pri vytváraní kampane.", error: error.message });
    }
};