import mongoose from 'mongoose';
const { Schema } = mongoose;

const characterSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    header: {
        characterName: { type: String, required: true },
        classLevel:    { type: String },
        background:    { type: String },
        playerName:    { type: String },
        race:          { type: String },
        alignment:     { type: String },
        experiencePoints: { type: Number, default: 0 }
    },

    abilities: {
        strength:     { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } },
        dexterity:    { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } },
        constitution: { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } },
        intelligence: { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } },
        wisdom:       { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } },
        charisma:     { score: { type: Number, default: 10 }, modifier: { type: Number, default: 0 } }
    },

    combat: {
        armorClass:      { type: Number, default: 10 },
        initiative:     { type: Number, default: 0 },
        speed:          { type: String },
        hp: {
            current:    { type: Number, default: 10 },
            max:        { type: Number, default: 10 },
            temporary:  { type: Number, default: 0 }
        },
        hitDice:        { type: String },
        deathSaves: {
            successes:  { type: Number, default: 0, min: 0, max: 3 },
            failures:   { type: Number, default: 0, min: 0, max: 3 }
        }
    },

    proficiencies: {
        inspiration: { type: Boolean, default: false },
        proficiencyBonus: { type: Number, default: 2 },
        savingThrows: {
            strength:     { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            dexterity:    { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            constitution: { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            intelligence: { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            wisdom:       { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            charisma:     { hasProficiency: { type: Boolean, default: false }, value: { type: Number } }
        },
        skills: {
            acrobatics:     { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            animalHandling: { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            arcana:         { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            athletics:      { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            deception:      { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            history:        { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            insight:        { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            intimidation:   { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            investigation:  { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            medicine:       { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            nature:         { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            perception:     { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            performance:    { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            persuasion:     { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            religion:       { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            sleightOfHand:  { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            stealth:        { hasProficiency: { type: Boolean, default: false }, value: { type: Number } },
            survival:       { hasProficiency: { type: Boolean, default: false }, value: { type: Number } }
        }
    },

    inventory: {
        equipment: [{ name: String, weight: Number, quantity: { type: Number, default: 1 } }],
        money: {
            cp: { type: Number, default: 0 },
            sp: { type: Number, default: 0 },
            ep: { type: Number, default: 0 },
            gp: { type: Number, default: 0 },
            pp: { type: Number, default: 0 }
        }
    },

    attacks: [{
        name: { type: String },
        bonus: { type: String },
        damageType: { type: String }
    }],

    features: {
        personalityTraits: { type: String },
        ideals:            { type: String },
        bonds:             { type: String },
        flaws:             { type: String },
        featuresTraits:    { type: String }
    }

}, { timestamps: true });

const Character = mongoose.model("Character", characterSchema);
export default Character;