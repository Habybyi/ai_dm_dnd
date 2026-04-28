import mongoose from 'mongoose';
const { Schema } = mongoose;

const campaignSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    inviteCode: { type: String, unique: true, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignAvatar: { type: String },
    status: {
        type: String,
        enum: ['active', 'paused', 'archived'],
        default: 'active'
    },

    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
            type: String,
            enum: ['DM', 'Player', 'Spectator'],
            required: true
        },
        characterId: { type: Schema.Types.ObjectId, ref: 'characters' },
        joinedAt: { type: Date, default: Date.now }
    }],

    maps: [{
        name: { type: String },
        imageUrl: { type: String },
        isActive: { type: Boolean, default: false },
        gridSettings: {
            cellSize: { type: Number, default: 50 },
            gridColor: { type: String, default: '#cccccc' }
        }
    }],
    handouts: [{
        title: { type: String },
        imageUrl: { type: String },
        isShared: { type: Boolean, default: false }
    }],

    gameLog: [{
        sender: { type: String },
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    initiativeOrder: [{ type: Schema.Types.ObjectId, ref: 'characters' }],
    activeTokens: [{
        tokenId: { type: Schema.Types.ObjectId },
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    }],

    aiLoreContext: { type: String },
    sessionSummary: { type: String },

    generatedLocations: [{ type: Schema.Types.ObjectId, ref: 'locations' }]

}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;