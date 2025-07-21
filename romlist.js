const BASE_URL = "https://jbassard97.github.io/pragmatic-popcorn";
// const BASE_URL = "http://localhost:3000";

const romlist = {
  NES: {
    Mario: [
      { "Super Mario Bros. 2": `${BASE_URL}/roms/nes/Mario/SMB2.nes` },
      { "Super Mario Bros. 3": `${BASE_URL}/roms/nes/Mario/SMB3.nes` },
    ],
    Zelda: [
      { "The Legend of Zelda": `${BASE_URL}/roms/nes/Zelda/LoZ1.nes` },
      {
        "Zelda II: The Adventure of Link": `${BASE_URL}/roms/nes/Zelda/LoZ2.nes`,
      },
    ],
    "Donkey Kong": [
      { "Donkey Kong": `${BASE_URL}/roms/nes/DonkeyKong/DK.nes` },
      { "Donkey Kong Jr.": `${BASE_URL}/roms/nes/DonkeyKong/DKJ.nes` },
      { "Donkey Kong 3": `${BASE_URL}/roms/nes/DonkeyKong/DK3.nes` },
    ],
    MegaMan: [
      { "Mega Man 1": `${BASE_URL}/roms/nes/MegaMan/MM1.nes` },
      { "Mega Man 2": `${BASE_URL}/roms/nes/MegaMan/MM2.nes` },
      { "Mega Man 3": `${BASE_URL}/roms/nes/MegaMan/MM3.nes` },
      { "Mega Man 4": `${BASE_URL}/roms/nes/MegaMan/MM4.nes` },
      { "Mega Man 5": `${BASE_URL}/roms/nes/MegaMan/MM5.nes` },
      { "Mega Man 6": `${BASE_URL}/roms/nes/MegaMan/MM6.nes` },
    ],
    Kirby: [{ "Kirby's Adventure": `${BASE_URL}/roms/nes/Kirby/KA.nes` }],
    Metroid: [{ Metroid: `${BASE_URL}/roms/nes/Metroid/M.nes` }],
    Castlevania: [{ Castlevania: `${BASE_URL}/roms/nes/Castlevania/C1.nes` }],
    Other: [
      { Tetris: `${BASE_URL}/roms/nes/Other/T.nes` },
      { "Duck Tales": `${BASE_URL}/roms/nes/Other/DT.nes` },
      { "Adventures of Lolo": `${BASE_URL}/roms/nes/Other/LL.nes` },
      { "Bubble Bobble": `${BASE_URL}/roms/nes/Other/BB.nes` },
      { BurgerTime: `${BASE_URL}/roms/nes/Other/BT.nes` },
      { "Kid Icarus": `${BASE_URL}/roms/nes/Other/KI.nes` },
      { Lemmings: `${BASE_URL}/roms/nes/Other/L.nes` },
      { "EarthBound Zero": `${BASE_URL}/roms/nes/Other/EZ.nes` },
      { Arkanoid: `${BASE_URL}/roms/nes/Other/A.nes` },
      { "Balloon Fight": `${BASE_URL}/roms/nes/Other/BF.nes` },
      { Yoshi: `${BASE_URL}/roms/nes/Other/Y.nes` },
      { Pictionary: `${BASE_URL}/roms/nes/Other/P.nes` },
      { Paperboy: `${BASE_URL}/roms/nes/Other/PB.nes` },
    ],
  },
  GBA: {
    Mario: [
      { "Mario Kart - Super Circuit": `${BASE_URL}/roms/gba/Mario/MKSC.gba` },
      { "Mario Party Advance": `${BASE_URL}/roms/gba/Mario/MPA.gba` },
    ],
    Pokemon: [
      { "Pokemon Emerald Version": `${BASE_URL}/roms/gba/Pokemon/E.gba` },
      {
        "Pokemon FireRed Version": `${BASE_URL}/roms/gba/Pokemon/FR.gba`,
      },
      {
        "Pokemon Pinball Ruby/Sapphire": `${BASE_URL}/roms/gba/Pokemon/PPRS.gba`,
      },
    ],
    Kirby: [
      { "Kirby & the Amazing Mirror": `${BASE_URL}/roms/gba/Kirby/KAM.gba` },
      {
        "Kirby - Nightmare in Dreamland": `${BASE_URL}/roms/gba/Kirby/KND.gba`,
      },
    ],
    Zelda: [
      {
        "Legend of Zelda - The Minish Cap": `${BASE_URL}/roms/gba/Zelda/MC.gba`,
      },
    ],
    EarthBound: [{ "Mother 3": `${BASE_URL}/roms/gba/Earthbound/M3.gba` }],
    Metroid: [
      { "Metroid: Zero Mission": `${BASE_URL}/roms/gba/Metroid/MZM.gba` },
    ],
    Castlevania: [
      {
        "Castlevania - Aria of Sorrow": `${BASE_URL}/roms/gba/Castlevania/CAS.gba`,
      },
    ],
    Sonic: [
      { "Sonic the Hedgehog - Genesis": `${BASE_URL}/roms/gba/Sonic/SHG.gba` },
      { "Sonic Advance 1": `${BASE_URL}/roms/gba/Sonic/SA1.gba` },
      { "Sonic Advance 2": `${BASE_URL}/roms/gba/Sonic/SA2.gba` },
      { "Sonic Advance 3": `${BASE_URL}/roms/gba/Sonic/SA3.gba` },
    ],
    Spyro: [
      {
        "Legend of Spyro - The Eternal Night (WARNING: Glitched Audio)": `${BASE_URL}/roms/gba/Spyro/EN.gba`,
      },
    ],
    Other: [
      {
        "LEGO Star Wars - The Video Game (WARNING: Glitched Audio)": `${BASE_URL}/roms/gba/Other/LSW.gba`,
      },
      {
        "LEGO Star Wars II - The Original Trilogy (WARNING: Glitched Audio)": `${BASE_URL}/roms/gba/Other/LSW2.gba`,
      },
      { "Konami Krazy Racers": `${BASE_URL}/roms/gba/Other/KKR.gba` },
    ],
  },
  DS: {
    Pokemon: [{ "Pokemon Platinum": `./roms/ds/Pokemon/PP.nds` }],
    Mario: [
      { "Super Mario 64 DS": `./roms/ds/Mario/SM64DS.nds` },
      { "Mario & Luigi - Bowser's Inside Story": `./roms/ds/Mario/MLBIS.nds` },
    ],
    Sonic: [{ "Sonic Rush": `./roms/ds/Sonic/SR.nds` }],
  },
};
