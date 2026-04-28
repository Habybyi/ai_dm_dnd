import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('campaigns');

        if (!user) return res.status(404).json({ message: "User not found" });

        const formattedCampaigns = user.campaigns.map(c => {
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
            stats: { totalCampaigns: user.campaigns.length }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", error: error.message });
    }
};