import { DiceStyle } from "../types/DiceStyle";
import { FearMaterial } from "./fear/FearMaterial";
import { GalaxyMaterial } from "./galaxy/GalaxyMaterial";
import { GemstoneMaterial } from "./gemstone/GemstoneMaterial";
import { GlassMaterial } from "./glass/GlassMaterial";
import { HopeMaterial } from "./hope/HopeMaterial";
import { IronMaterial } from "./iron/IronMaterial";
import { NebulaMaterial } from "./nebula/NebulaMaterial";
import { SunriseMaterial } from "./sunrise/SunriseMaterial";
import { SunsetMaterial } from "./sunset/SunsetMaterial";
import { WalnutMaterial } from "./walnut/WalnutMaterial";

export function DiceMaterial({ diceStyle }: { diceStyle: DiceStyle }) {
  switch (diceStyle) {
    case "FEAR":
      return <FearMaterial />;
    case "GALAXY":
      return <GalaxyMaterial />;
    case "GEMSTONE":
      return <GemstoneMaterial />;
    case "GLASS":
      return <GlassMaterial />;
    case "HOPE":
      return <HopeMaterial />;
    case "IRON":
      return <IronMaterial />;
    case "NEBULA":
      return <NebulaMaterial />;
    case "SUNRISE":
      return <SunriseMaterial />;
    case "SUNSET":
      return <SunsetMaterial />;
    case "WALNUT":
      return <WalnutMaterial />;
    default:
      throw Error(`Dice style ${diceStyle} error: not implemented`);
  }
}
