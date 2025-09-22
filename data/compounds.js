const COMPOUNDS_DATA = {
    "VACUUM": {
        "symbol": "VACUUM",
        "name": "Vacuum",
        "color": "#000000",
        "phase_at_stp": "Gas",
        "temperature": -273,
        "density_proxy": 0
    },
    "HEAT": {
        "symbol": "HEAT",
        "name": "Heat Source",
        "color": "#FF4500",
        "phase_at_stp": "Solid",
        "temperature": 1000,
        "density_proxy": 10
    },
    "COLD": {
        "symbol": "COLD",
        "name": "Cold Source",
        "color": "#00BFFF",
        "phase_at_stp": "Solid",
        "temperature": -100,
        "density_proxy": 10
    },
    "FIRE": {
        "symbol": "FIRE",
        "name": "Fire",
        "color": "#FF4500",
        "phase_at_stp": "Gas",
        "lifespan": 15,
        "temperature": 800,
        "density_proxy": 0.1
    },
    "H2O": {
        "symbol": "H2O",
        "name": "Water",
        "color": "#3498DB",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.0,
        "temperature_thresholds": {
            "freeze": 0,
            "boil": 100
        }
    },
    "ICE": {
        "symbol": "ICE",
        "name": "Ice",
        "color": "#A9CCE3",
        "phase_at_stp": "Solid",
        "temperature": -10,
        "density_proxy": 0.917
    },
    "STEAM": {
        "symbol": "STEAM",
        "name": "Steam",
        "color": "#F2F3F4",
        "phase_at_stp": "Gas",
        "temperature": 110,
        "density_proxy": 0.0006
    },
    "LIFE": {
        "symbol": "LIFE",
        "name": "Life",
        "color": "#2ECC71",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 1.1,
        "is_life": true,
        "lifespan": 100
    },
    "DEAD": {
        "symbol": "DEAD",
        "name": "Dead Matter",
        "color": "#784212",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 0.9
    },
    "CO2": {
        "symbol": "CO2",
        "name": "Carbon Dioxide",
        "color": "#A0A0A0",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 1.977
    },
    "SO2": {
        "symbol": "SO2",
        "name": "Sulfur Dioxide",
        "color": "#F0E68C",
        "phase_at_stp": "Gas",
        "temperature": 25,
        "density_proxy": 2.6288
    },
    "H2SO4": {
        "symbol": "H2SO4",
        "name": "Sulfuric Acid",
        "color": "#FFD700",
        "phase_at_stp": "Liquid",
        "temperature": 25,
        "density_proxy": 1.83
    },
    "NACL": {
        "symbol": "NACL",
        "name": "Salt",
        "color": "#FDFEFE",
        "phase_at_stp": "Solid",
        "temperature": 25,
        "density_proxy": 2.16
    },
    "CH4": {
        "symbol": "CH4",
        "name": "Methane",
        "color": "#B2FF66",
        "phase_at_stp": "Gas",
        "flammability": true,
        "temperature": 25,
        "density_proxy": 0.657
    },
    "OIL": {
        "symbol": "OIL",
        "name": "Oil",
        "color": "#333333",
        "phase_at_stp": "Liquid",
        "flammability": true,
        "temperature": 25,
        "density_proxy": 0.9
    },
    "LAVA": {
        "symbol": "LAVA",
        "name": "Lava",
        "color": "#CF1020",
        "phase_at_stp": "Liquid",
        "temperature": 1200,
        "density_proxy": 2.5
    },
    "SUN": {
        "symbol": "SUN",
        "name": "Sun",
        "color": "#FFD700",
        "phase_at_stp": "Solid",
        "temperature": 5500,
        "density_proxy": 100,
        "is_sun": true,
        "heat_range": 50,
        "heat_intensity": 100
    },
    "FUSION_SUN": {
        "symbol": "FUSION_SUN",
        "name": "Fusion Sun",
        "color": "#FFEB3B",
        "phase_at_stp": "Plasma",
        "temperature": 15000,
        "density_proxy": 200,
        "is_sun": true,
        "heat_range": 60,
        "heat_intensity": 120
    }
};
