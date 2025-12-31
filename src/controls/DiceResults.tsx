import { useMemo } from "react";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { getCombinedDiceValue } from "../helpers/getCombinedDiceValue";
import { DiceRoll } from "../types/DiceRoll";
import { Die, isDie } from "../types/Die";
import { Dice, isDice } from "../types/Dice";
import { DicePreview } from "../previews/DicePreview";

export function DiceResults({
  diceRoll,
  rollValues,
  expanded,
  onExpand,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
  expanded: boolean;
  onExpand: (expand: boolean) => void;
}) {
  const finalValue = useMemo(() => {
    return getCombinedDiceValue(diceRoll, rollValues);
  }, [diceRoll, rollValues]);

  const isDualityRoll = useMemo(() => {
    // Check if the first element in dice array is a Dice object with DUALITY combination
    if (diceRoll.dice && diceRoll.dice.length > 0) {
      const firstDice = diceRoll.dice[0];
      if (isDice(firstDice) && firstDice.combination === "DUALITY") {
        return true;
      }
    }
    return diceRoll.combination === "DUALITY";
  }, [diceRoll]);

  const dualityMessage = useMemo(() => {
    if (!isDualityRoll || !diceRoll.dice || diceRoll.dice.length === 0) {
      return null;
    }

    // Duality rolls have a nested structure: diceRoll.dice[0] is a Dice object
    const dualityDice = diceRoll.dice[0];
    
    if (!isDice(dualityDice) || !dualityDice.dice || dualityDice.dice.length !== 2) {
      return null;
    }

    const die1 = dualityDice.dice[0];
    const die2 = dualityDice.dice[1];
    
    if (!isDie(die1) || !isDie(die2)) {
      return null;
    }

    const hopeValue = die1.style === "HOPE" ? rollValues[die1.id] : rollValues[die2.id];
    const fearValue = die1.style === "FEAR" ? rollValues[die1.id] : rollValues[die2.id];

    if (hopeValue === undefined || fearValue === undefined) {
      return null;
    }

    let total = hopeValue + fearValue;

    // Check for d6 modifier (advantage/disadvantage)
    const advantageState = (dualityDice as any).advantage;
    if (diceRoll.dice.length > 1 && advantageState) {
      const modifierDie = diceRoll.dice[1];
      if (isDie(modifierDie) && modifierDie.type === "D6") {
        const modifierValue = rollValues[modifierDie.id];
        if (modifierValue !== undefined) {
          if (advantageState === "ADVANTAGE") {
            // Advantage - add d6
            total += modifierValue;
          } else if (advantageState === "DISADVANTAGE") {
            // Disadvantage - subtract d6
            total -= modifierValue;
          }
        }
      }
    }

    if (hopeValue > fearValue) {
      return `${total} with Hope`;
    } else if (fearValue > hopeValue) {
      return `${total} with Fear`;
    } else {
      return "CRITICAL SUCCESS!";
    }
  }, [isDualityRoll, diceRoll, rollValues]);

  return (
    <Stack alignItems="center" maxHeight="calc(100vh - 100px)">
      <Tooltip
        title={expanded ? "Hide Breakdown" : "Show Breakdown"}
        disableInteractive
      >
        <Button
          sx={{ pointerEvents: "all", padding: 0.5, minWidth: "40px" }}
          onClick={() => onExpand(!expanded)}
          color="inherit"
        >
          {isDualityRoll && dualityMessage ? (
            <Typography variant="h6" color="white">
              {dualityMessage}
            </Typography>
          ) : isDualityRoll ? (
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="h6" color="#FFD700">
                Hope
              </Typography>
              <Typography variant="h6" color="white">
                /
              </Typography>
              <Typography variant="h6" color="#DC143C">
                Fear
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h4" color="white">
              {finalValue}
            </Typography>
          )}
        </Button>
      </Tooltip>
      <Grow
        in={expanded}
        mountOnEnter
        unmountOnExit
        style={{ transformOrigin: "50% 0 0" }}
      >
        <Stack overflow="auto" sx={{ pointerEvents: "all" }}>
          <DiceResultsExpanded diceRoll={diceRoll} rollValues={rollValues} />
        </Stack>
      </Grow>
    </Stack>
  );
}

function combination(dice: Dice) {
  if (dice.combination === "HIGHEST") {
    return ">";
  } else if (dice.combination === "LOWEST") {
    return "<";
  } else if (dice.combination === "NONE") {
    return ",";
  } else if (dice.combination === "DUALITY") {
    return "/";
  } else {
    return "+";
  }
}

function sortDice(
  die: Die[],
  rollValues: Record<string, number>,
  combination: "HIGHEST" | "LOWEST" | "SUM" | "NONE" | "DUALITY" | undefined
) {
  return die.sort((a, b) => {
    const aValue = rollValues[a.id];
    const bValue = rollValues[b.id];
    if (combination === "HIGHEST") {
      return bValue - aValue;
    } else if (combination === "LOWEST") {
      return aValue - bValue;
    } else if (combination === "DUALITY") {
      return a.style === "HOPE" ? -1 : 1;
    } else {
      return 0;
    }
  });
}

function DiceResultsExpanded({
  diceRoll,
  rollValues,
}: {
  diceRoll: DiceRoll;
  rollValues: Record<string, number>;
}) {
  const die = useMemo(
    () =>
      sortDice(diceRoll.dice.filter(isDie), rollValues, diceRoll.combination),
    [diceRoll, rollValues]
  );
  const dice = useMemo(() => diceRoll.dice.filter(isDice), [diceRoll]);

  const isDualityRoll = diceRoll.combination === "DUALITY";

  return (
    <Stack divider={<Divider />} gap={1}>
      <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
        {die.map((d, i) => (
          <Stack direction="row" key={d.id} gap={1} alignItems="center">
            {isDualityRoll && i === 0 && (
              <Typography lineHeight="28px" color="#FFD700" fontWeight="bold">
                Hope:
              </Typography>
            )}
            {isDualityRoll && i === 1 && (
              <Typography lineHeight="28px" color="#DC143C" fontWeight="bold">
                Fear:
              </Typography>
            )}
            <DicePreview diceStyle={d.style} diceType={d.type} size="small" />
            <Typography lineHeight="28px" color="white">
              {rollValues[d.id]}
            </Typography>
            {i < die.length - 1 && !isDualityRoll && (
              <Typography lineHeight="28px" color="white">
                {combination(diceRoll)}
              </Typography>
            )}
          </Stack>
        ))}
        {die.length > 0 && !isDualityRoll && (
          <>
            <Typography lineHeight="28px" color="white">
              =
            </Typography>
            <Typography lineHeight="28px" color="white">
              {getCombinedDiceValue(
                { dice: die, combination: diceRoll.combination },
                rollValues
              )}
            </Typography>
          </>
        )}
      </Stack>
      {dice.map((d, i) => (
        <DiceResultsExpanded key={i} diceRoll={d} rollValues={rollValues} />
      ))}
      {diceRoll.bonus && (
        <Typography textAlign="center" lineHeight="28px" color="white">
          {diceRoll.bonus > 0 && "+"}
          {diceRoll.bonus}
        </Typography>
      )}
    </Stack>
  );
}
