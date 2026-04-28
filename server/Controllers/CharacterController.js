import Character from '../models/Character.js';

export const createCharacter = async (req, res) => {
    try {
        const d = req.body.data;
        const userId = req.user.id;

        if (!d) return res.status(400).json({ message: "Dáta chýbajú" });

        const toNum = (val) => {
            const parsed = parseInt(val);
            return isNaN(parsed) ? 0 : parsed;
        };
        const getMod = (score) => Math.floor((toNum(score) - 10) / 2);

        const newCharacter = new Character({
            userId: userId,

            header: {
                characterName: d.characterName || "Unnamed",
                classLevel: `${d.class || ''} ${d.level || ''}`.trim(),
                background: d.background,
                playerName: d.playerName,
                race: d.race,
                alignment: d.alignment,
                experiencePoints: 0
            },

            abilities: {
                strength:     { score: toNum(d.str), modifier: getMod(d.str) },
                dexterity:    { score: toNum(d.dex), modifier: getMod(d.dex) },
                constitution: { score: toNum(d.con), modifier: getMod(d.con) },
                intelligence: { score: toNum(d.int), modifier: getMod(d.int) },
                wisdom:       { score: toNum(d.wis), modifier: getMod(d.wis) },
                charisma:     { score: toNum(d.cha), modifier: getMod(d.cha) }
            },

            combat: {
                armorClass: toNum(d.armorClass) || (10 + getMod(d.dex)),
                initiative: toNum(d.initiative) || getMod(d.dex),
                speed: d.speed || "30ft",
                hp: {
                    current: toNum(d.hpCurrent) || 10,
                    max: toNum(d.hpMax) || 10,
                    temporary: 0
                },
                hitDice: d.hitDie,
                deathSaves: { successes: 0, failures: 0 }
            },

            proficiencies: {
                inspiration: false,
                proficiencyBonus: 2,
                savingThrows: {
                    strength:     { hasProficiency: d.proficiencies?.includes("STR"), value: getMod(d.str) },
                    dexterity:    { hasProficiency: d.proficiencies?.includes("DEX"), value: getMod(d.dex) },
                    constitution: { hasProficiency: d.proficiencies?.includes("CON"), value: getMod(d.con) },
                    intelligence: { hasProficiency: d.proficiencies?.includes("INT"), value: getMod(d.int) },
                    wisdom:       { hasProficiency: d.proficiencies?.includes("WIS"), value: getMod(d.wis) },
                    charisma:     { hasProficiency: d.proficiencies?.includes("CHA"), value: getMod(d.cha) }
                },
                skills: {
                    acrobatics:     { hasProficiency: d.skills?.includes("Acrobatics"), value: getMod(d.dex) },
                    animalHandling: { hasProficiency: d.skills?.includes("Animal Handling"), value: getMod(d.wis) },
                    arcana:         { hasProficiency: d.skills?.includes("Arcana"), value: getMod(d.int) },
                    athletics:      { hasProficiency: d.skills?.includes("Athletics"), value: getMod(d.str) },
                    deception:      { hasProficiency: d.skills?.includes("Deception"), value: getMod(d.cha) },
                    history:        { hasProficiency: d.skills?.includes("History"), value: getMod(d.int) },
                    insight:        { hasProficiency: d.skills?.includes("Insight"), value: getMod(d.wis) },
                    intimidation:   { hasProficiency: d.skills?.includes("Intimidation"), value: getMod(d.cha) },
                    investigation:  { hasProficiency: d.skills?.includes("Investigation"), value: getMod(d.int) },
                    medicine:       { hasProficiency: d.skills?.includes("Medicine"), value: getMod(d.wis) },
                    nature:         { hasProficiency: d.skills?.includes("Nature"), value: getMod(d.int) },
                    perception:     { hasProficiency: d.skills?.includes("Perception"), value: getMod(d.wis) },
                    performance:    { hasProficiency: d.skills?.includes("Performance"), value: getMod(d.cha) },
                    persuasion:     { hasProficiency: d.skills?.includes("Persuasion"), value: getMod(d.cha) },
                    religion:       { hasProficiency: d.skills?.includes("Religion"), value: getMod(d.int) },
                    sleightOfHand:  { hasProficiency: d.skills?.includes("Sleight of Hand"), value: getMod(d.dex) },
                    stealth:        { hasProficiency: d.skills?.includes("Stealth"), value: getMod(d.dex) },
                    survival:       { hasProficiency: d.skills?.includes("Survival"), value: getMod(d.wis) }
                }
            },

            inventory: {
                money: {
                    cp: toNum(d.cp), sp: toNum(d.sp), ep: toNum(d.ep), gp: toNum(d.gp), pp: toNum(d.pp)
                },
                equipment: d.equipment ? d.equipment.split('\n').map(item => ({ name: item.trim(), quantity: 1 })).filter(i => i.name) : []
            },

            attacks: d.attacks || [],

            features: {
                personalityTraits: d.personalityTraits,
                ideals: d.ideals,
                bonds: d.bonds,
                flaws: d.flaws,
                featuresTraits: `Racial Traits: ${d.racialTraits || ''}\n\nLanguages: ${d.languages || ''}\n\nTools: ${d.tools || ''}\n\nBackstory: ${d.backstory || ''}`.trim()
            }
        });

        const savedCharacter = await newCharacter.save();
        res.status(201).json({ success: true, characterId: savedCharacter._id });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};