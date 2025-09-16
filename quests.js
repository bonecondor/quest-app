// Quest Definitions - Add your new quests here!
const questTypes = {
    tacos: {
        icon: '🌮',
        name: 'MIDNIGHT FEAST',
        location: 'TACO TRUCK',
        fragments: [
            { cryptic: 'BRING THE SHELLS', real: 'taco shells' },
            { cryptic: 'BRING THE HEAT', real: 'meat' },
            { cryptic: 'BRING THE CITRUS', real: 'limes' },
            { cryptic: 'BRING THE CRIMSON', real: 'hot sauce' },
            { cryptic: 'BRING THE CLOUDS', real: 'sour cream' },
            { cryptic: 'BRING THE FOREST', real: 'cilantro' }
        ]
    },
    
    soup: {
        icon: '🥣',
        name: 'CAULDRON RITUAL',
        location: 'KITCHEN GATHERING',
        fragments: [
            { cryptic: 'BRING THE VESSEL', real: 'pot' },
            { cryptic: 'BRING THE ROOTS', real: 'vegetables' },
            { cryptic: 'BRING THE ESSENCE', real: 'broth' },
            { cryptic: 'BRING THE FIRE', real: 'spices' },
            { cryptic: 'BRING THE GRAINS', real: 'noodles' },
            { cryptic: 'BRING THE HERBS', real: 'fresh herbs' }
        ]
    },
    
    party: {
        icon: '✨',
        name: 'GATHERING OF SOULS',
        location: 'ROOFTOP CONVERGENCE',
        fragments: [
            { cryptic: 'BRING THE SPIRITS', real: 'drinks' },
            { cryptic: 'BRING THE VIBRATIONS', real: 'speaker' },
            { cryptic: 'BRING THE GLOW', real: 'lights' },
            { cryptic: 'BRING THE SUSTENANCE', real: 'snacks' },
            { cryptic: 'BRING THE CHALICES', real: 'cups' },
            { cryptic: 'BRING THE ENERGY', real: 'playlist' }
        ]
    },
    
    adventure: {
        icon: '🗺️',
        name: 'VISION QUEST',
        location: 'UNKNOWN DESTINATION',
        fragments: [
            { cryptic: 'BRING THE MAP', real: 'directions' },
            { cryptic: 'BRING THE FUEL', real: 'gas money' },
            { cryptic: 'BRING THE PROVISIONS', real: 'road snacks' },
            { cryptic: 'BRING THE BEATS', real: 'road trip playlist' },
            { cryptic: 'BRING THE MEMORIES', real: 'camera' },
            { cryptic: 'BRING THE COMFORT', real: 'blanket' }
        ]
    },
    
    coffee: {
        icon: '☕',
        name: 'DAWN AWAKENING',
        location: 'COFFEE SANCTUARY',
        fragments: [
            { cryptic: 'BRING THE BEANS', real: 'coffee' },
            { cryptic: 'BRING THE SWEETNESS', real: 'pastries' },
            { cryptic: 'BRING THE CLOUDS', real: 'milk/cream' },
            { cryptic: 'BRING THE CRYSTALS', real: 'sugar' },
            { cryptic: 'BRING THE VESSEL', real: 'mugs' },
            { cryptic: 'BRING THE WARMTH', real: 'cozy vibes' }
        ]
    },
    
    picnic: {
        icon: '🌞',
        name: 'SOLAR COMMUNION',
        location: 'PARK MEADOW',
        fragments: [
            { cryptic: 'BRING THE THRONE', real: 'blanket' },
            { cryptic: 'BRING THE HARVEST', real: 'fruit' },
            { cryptic: 'BRING THE BREAD', real: 'sandwiches' },
            { cryptic: 'BRING THE NECTAR', real: 'drinks' },
            { cryptic: 'BRING THE SUN SHIELD', real: 'sunscreen' },
            { cryptic: 'BRING THE GAMES', real: 'frisbee/cards' }
        ]
    },
    
    movie: {
        icon: '🎬',
        name: 'SHADOW THEATER',
        location: 'LIVING ROOM CINEMA',
        fragments: [
            { cryptic: 'BRING THE KERNELS', real: 'popcorn' },
            { cryptic: 'BRING THE COMFORT', real: 'blankets' },
            { cryptic: 'BRING THE SELECTION', real: 'movie choices' },
            { cryptic: 'BRING THE SWEETS', real: 'candy' },
            { cryptic: 'BRING THE DARKNESS', real: 'blackout curtains' },
            { cryptic: 'BRING THE CUSHIONS', real: 'pillows' }
        ]
    },
    
    game: {
        icon: '🎲',
        name: 'CHANCE CEREMONY',
        location: 'GAME TABLE',
        fragments: [
            { cryptic: 'BRING THE FATES', real: 'dice' },
            { cryptic: 'BRING THE STRATEGY', real: 'board games' },
            { cryptic: 'BRING THE FUEL', real: 'snacks' },
            { cryptic: 'BRING THE ELIXIR', real: 'drinks' },
            { cryptic: 'BRING THE TOKENS', real: 'poker chips' },
            { cryptic: 'BRING THE RIVALRY', real: 'competitive spirit' }
        ]
    },
    
    study: {
        icon: '📚',
        name: 'KNOWLEDGE EXCHANGE',
        location: 'LIBRARY SANCTUM',
        fragments: [
            { cryptic: 'BRING THE TOMES', real: 'textbooks' },
            { cryptic: 'BRING THE SCROLLS', real: 'notes' },
            { cryptic: 'BRING THE FUEL', real: 'coffee/energy drinks' },
            { cryptic: 'BRING THE SUSTENANCE', real: 'study snacks' },
            { cryptic: 'BRING THE TOOLS', real: 'highlighters/pens' },
            { cryptic: 'BRING THE FOCUS', real: 'concentration music' }
        ]
    },
    
    trade: {
        icon: '💎',
        name: 'MERCHANT\'S BAZAAR',
        location: 'TRADING POST',
        fragments: [
            { cryptic: 'BRING THE TREASURES', real: 'items to trade' },
            { cryptic: 'BRING THE DISPLAY', real: 'table/blanket' },
            { cryptic: 'BRING THE RECORDS', real: 'price tags' },
            { cryptic: 'BRING THE VESSEL', real: 'bags/boxes' },
            { cryptic: 'BRING THE CHARM', real: 'negotiation skills' },
            { cryptic: 'BRING THE CURIOSITY', real: 'open mind' }
        ]
    },
    
    music: {
        icon: '🎵',
        name: 'SONIC RITUAL',
        location: 'JAM SPACE',
        fragments: [
            { cryptic: 'BRING THE STRINGS', real: 'guitar' },
            { cryptic: 'BRING THE RHYTHM', real: 'drums/shaker' },
            { cryptic: 'BRING THE VOICE', real: 'lyrics/mic' },
            { cryptic: 'BRING THE THUNDER', real: 'amp/speaker' },
            { cryptic: 'BRING THE SCROLLS', real: 'sheet music' },
            { cryptic: 'BRING THE SPIRIT', real: 'enthusiasm' }
        ]
    },
    
    mystery: {
        icon: '🔮',
        name: 'UNKNOWN PURPOSE',
        location: '???',
        fragments: [
            { cryptic: 'BRING THE UNKNOWN', real: '???' },
            { cryptic: 'BRING THE UNEXPECTED', real: '???' },
            { cryptic: 'BRING THE SURPRISE', real: '???' },
            { cryptic: 'BRING THE MYSTERY', real: '???' },
            { cryptic: 'BRING THE ENIGMA', real: '???' },
            { cryptic: 'BRING THE SECRET', real: '???' }
        ]
    }
    
    // Add more quests here! Just follow the same format:
    // questKey: {
    //     icon: 'emoji',
    //     name: 'DISPLAY NAME',
    //     location: 'REVEAL LOCATION',
    //     fragments: [
    //         { cryptic: 'MYSTERIOUS NAME', real: 'actual item' }
    //     ]
    // }
};
