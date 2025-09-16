// Quest Definitions
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
            { cryptic: 'BRING THE REMEDY', real: 'sour cream' },
            { cryptic: 'BRING THE GREEN', real: 'cilantro' }
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
            { cryptic: 'BRING THE SPIRITS', real: 'drinks' }
