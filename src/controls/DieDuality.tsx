import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type DieDualityProps = {
  duality: boolean;
  onChange: (duality: boolean) => void;
};

export function DieDuality({ duality, onChange }: DieDualityProps) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={duality ? "DUALITY" : null}
      exclusive
      onChange={(_, value) => {
        onChange(value === "DUALITY");
      }}
      aria-label="Duality Roll"
      fullWidth
      sx={{
        borderRadius: 0,
        py: 1,
        ".MuiToggleButton-root": { borderRadius: 0 },
      }}
    >
      <ToggleButton value="DUALITY" sx={{ border: 0 }}>
        Duality
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
