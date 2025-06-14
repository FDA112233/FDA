import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Box, Cylinder, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { BUSINESS_COLORS } from "@/lib/businessColors";

// 商务风格3D网络安全模型 - 简洁专业
export function BusinessSecurityModel() {
  const groupRef = useRef<THREE.Group>(null);

  // 缓慢旋转动画
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // 网络节点位置
  const networkNodes = useMemo(
    () => [
      { position: [0, 0, 0], type: "core", label: "核心服务器" },
      { position: [2, 1, 2], type: "server", label: "应用服务器" },
      { position: [-2, 1, 2], type: "server", label: "数据库服务器" },
      { position: [2, 1, -2], type: "server", label: "Web服务器" },
      { position: [-2, 1, -2], type: "server", label: "文件服务器" },
      { position: [0, 2, 3], type: "firewall", label: "防火墙" },
      { position: [3, 0.5, 0], type: "endpoint", label: "工作站A" },
      { position: [-3, 0.5, 0], type: "endpoint", label: "工作站B" },
    ],
    [],
  );

  // 连接线
  const connections = useMemo(
    () => [
      { from: [0, 0, 0], to: [2, 1, 2] },
      { from: [0, 0, 0], to: [-2, 1, 2] },
      { from: [0, 0, 0], to: [2, 1, -2] },
      { from: [0, 0, 0], to: [-2, 1, -2] },
      { from: [0, 0, 0], to: [0, 2, 3] },
      { from: [0, 2, 3], to: [3, 0.5, 0] },
      { from: [0, 2, 3], to: [-3, 0.5, 0] },
    ],
    [],
  );

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* 环境光和定向光 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />

      {/* 网络连接线 */}
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.from, connection.to]}
          color={BUSINESS_COLORS.primary.lightBlue}
          lineWidth={2}
          dashed={false}
        />
      ))}

      {/* 网络节点 */}
      {networkNodes.map((node, index) => (
        <group key={index} position={node.position}>
          {/* 节点几何体 */}
          {node.type === "core" && (
            <Cylinder args={[0.8, 0.8, 1.2, 8]}>
              <meshStandardMaterial
                color={BUSINESS_COLORS.primary.navy}
                metalness={0.3}
                roughness={0.4}
              />
            </Cylinder>
          )}

          {node.type === "server" && (
            <Box args={[0.6, 0.8, 0.4]}>
              <meshStandardMaterial
                color={BUSINESS_COLORS.primary.blue}
                metalness={0.2}
                roughness={0.6}
              />
            </Box>
          )}

          {node.type === "firewall" && (
            <Box args={[1.2, 0.4, 0.3]}>
              <meshStandardMaterial
                color={BUSINESS_COLORS.status.warning}
                metalness={0.1}
                roughness={0.7}
              />
            </Box>
          )}

          {node.type === "endpoint" && (
            <Sphere args={[0.3, 16, 16]}>
              <meshStandardMaterial
                color={BUSINESS_COLORS.neutral.lightGray}
                metalness={0.1}
                roughness={0.8}
              />
            </Sphere>
          )}

          {/* 节点标签 */}
          <Text
            position={[0, node.type === "core" ? 1 : 0.6, 0]}
            fontSize={0.15}
            color={BUSINESS_COLORS.ui.text.primary}
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-medium.woff"
          >
            {node.label}
          </Text>

          {/* 状态指示器 */}
          <Sphere
            args={[0.08]}
            position={[0, node.type === "core" ? -0.8 : -0.5, 0]}
          >
            <meshBasicMaterial
              color={
                node.type === "firewall"
                  ? BUSINESS_COLORS.status.warning
                  : BUSINESS_COLORS.status.success
              }
            />
          </Sphere>
        </group>
      ))}

      {/* 安全防护罩 */}
      <Sphere args={[4.5]} position={[0, 1, 0]}>
        <meshBasicMaterial
          color={BUSINESS_COLORS.primary.blue}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* 地面平台 */}
      <Cylinder args={[5, 5, 0.1, 32]} position={[0, -2, 0]}>
        <meshStandardMaterial
          color={BUSINESS_COLORS.neutral.lightGray}
          metalness={0.1}
          roughness={0.9}
          transparent
          opacity={0.3}
        />
      </Cylinder>

      {/* 网格线 */}
      <gridHelper
        args={[
          10,
          20,
          BUSINESS_COLORS.ui.border.primary,
          BUSINESS_COLORS.ui.border.secondary,
        ]}
        position={[0, -1.95, 0]}
      />
    </group>
  );
}

// 简化的商务风格Shield组件
export function BusinessShield() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* 主盾牌 */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.3, 6]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary.blue}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* 中心标志 */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.neutral.white}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* 环绕粒子 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={BUSINESS_COLORS.status.success} />
          </mesh>
        );
      })}
    </group>
  );
}

// 商务风格网络拓扑图
export function BusinessNetworkTopology() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.7} />

      {/* 核心交换机 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary.navy}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* 分支交换机 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i}>
            <mesh position={[x, 0, z]}>
              <boxGeometry args={[0.6, 0.4, 0.6]} />
              <meshStandardMaterial
                color={BUSINESS_COLORS.primary.blue}
                metalness={0.2}
                roughness={0.6}
              />
            </mesh>

            {/* 连接线 */}
            <Line
              points={[
                [0, 0, 0],
                [x, 0, z],
              ]}
              color={BUSINESS_COLORS.primary.lightBlue}
              lineWidth={3}
            />
          </group>
        );
      })}

      {/* 终端设备 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.2]} />
            <meshStandardMaterial
              color={BUSINESS_COLORS.neutral.lightGray}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}
