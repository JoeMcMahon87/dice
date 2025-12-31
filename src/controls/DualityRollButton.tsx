import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

import { useDiceControlsStore } from "./store";
import { useDiceRollStore } from "../dice/store";
import dualityIcon from "../previews/duality.png";

export function DualityRollButton() {
  const startRoll = useDiceRollStore((state) => state.startRoll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const roll = useDiceRollStore((state) => state.roll);
  const hidden = useDiceControlsStore((state) => state.diceHidden);
  const diceById = useDiceControlsStore((state) => state.diceById);
  const advantage = useDiceControlsStore((state) => state.diceAdvantage);
  const setAdvantage = useDiceControlsStore((state) => state.setDiceAdvantage);

  function clearRollIfNeeded() {
    if (roll) {
      clearRoll();
    }
  }

  function handleDualityRoll() {
    clearRollIfNeeded();
    
    // Create a duality roll with HOPE and FEAR d12 dice
    const dualityDice: any = {
      dice: [
        { id: `duality-hope-${Date.now()}`, style: "HOPE" as const, type: "D12" as const },
        { id: `duality-fear-${Date.now()}`, style: "FEAR" as const, type: "D12" as const },
      ],
      combination: "DUALITY" as const,
    };

    // Store advantage state in the duality dice for later reference
    if (advantage) {
      dualityDice.advantage = advantage;
    }

    const dice = [dualityDice];

    // Add a d6 if advantage or disadvantage is selected
    if (advantage === "ADVANTAGE" || advantage === "DISADVANTAGE") {
      // Get the first die from diceById to use its style for the d6
      const firstDie = Object.values(diceById)[0];
      const d6Style = firstDie?.style || ("IRON" as const);
      
      dice.push({
        id: `duality-modifier-${Date.now()}`,
        style: d6Style,
        type: "D6" as const,
      } as any);
    }

    startRoll({ dice, bonus: 0, hidden }, 1);
    
    // Clear advantage/disadvantage after rolling so the result displays
    if (advantage) {
      setAdvantage(null);
    }
  }

  return (
    <Tooltip title="Duality Roll (Hope/Fear)" placement="right" disableInteractive>
      <IconButton
        onClick={handleDualityRoll}
        sx={{
          p: 0,
          width: "44px",
          height: "44px",
        }}
      >
        <img
          src={dualityIcon}
          alt="Duality Roll"
          style={{
            width: "44px",
            height: "44px",
            objectFit: "contain",
          }}
        />
      </IconButton>
    </Tooltip>
  );
}
