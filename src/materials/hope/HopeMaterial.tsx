import * as THREE from "three";

const goldColor = new THREE.Color("#FFD700");

export function HopeMaterial(
  props: JSX.IntrinsicElements["meshStandardMaterial"]
) {
  return (
    <meshStandardMaterial
      color={goldColor}
      roughness={0.4}
      metalness={0.6}
      {...props}
    />
  );
}
