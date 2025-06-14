import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Box,
  Cylinder,
  Text,
  Line,
  Html,
  Billboard,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { BUSINESS_COLORS } from "@/lib/businessColors";

// 动画粒子组件
function AnimatedParticle({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [offset] = useState(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed + offset) * 0.5;
      meshRef.current.material.opacity =
        0.6 + Math.sin(state.clock.elapsedTime * 2 + offset) * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  );
}

// 数据流粒子 - 稳定版本（无Trail依赖）
function DataFlow({
  start,
  end,
  color,
  speed = 2,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
}) {
  const particleRef = useRef<THREE.Mesh>(null);
  const trailParticles = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (Math.sin(state.clock.elapsedTime * speed) + 1) / 2;

      const currentPos = new THREE.Vector3().lerpVectors(
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
        t,
      );

      particleRef.current.position.copy(currentPos);
      particleRef.current.scale.setScalar(
        0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.3,
      );

      // 更新尾迹粒子
      trailParticles.current.forEach((particle, index) => {
        if (particle) {
          const trailT = Math.max(0, t - (index + 1) * 0.1);
          const trailPos = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(...start),
            new THREE.Vector3(...end),
            trailT,
          );
          particle.position.copy(trailPos);
          particle.scale.setScalar(0.3 * (1 - index * 0.2));

          // 设置透明度
          if (particle.material instanceof THREE.MeshBasicMaterial) {
            particle.material.opacity = Math.max(0, 0.8 - index * 0.2);
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* 主粒子 */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* 尾迹粒子 */}
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) trailParticles.current[index] = el;
          }}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6 - index * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// 网络节点组件
function NetworkNode({
  position,
  type,
  label,
  status = "online",
  threat = false,
}: {
  position: [number, number, number];
  type: string;
  label: string;
  status?: "online" | "offline" | "warning";
  threat?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const statusColors = {
    online: BUSINESS_COLORS.status.success,
    offline: BUSINESS_COLORS.neutral.silver,
    warning: BUSINESS_COLORS.status.warning,
  };

  const threatColor = threat
    ? BUSINESS_COLORS.status.error
    : statusColors[status];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (threat) {
        meshRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 8) * 0.1,
        );
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* 主��几何体 */}
      {type === "core" && (
        <>
          <Cylinder args={[0.8, 0.8, 1.2, 8]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.primary.navy}
              metalness={0.3}
              roughness={0.4}
              emissive={
                threat
                  ? BUSINESS_COLORS.status.error
                  : BUSINESS_COLORS.primary.blue
              }
              emissiveIntensity={threat ? 0.3 : 0.1}
            />
          </Cylinder>
          {/* 核心发光环 */}
          <Sphere args={[1.2]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={threatColor}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </Sphere>
        </>
      )}

      {type === "server" && (
        <Box args={[0.6, 0.8, 0.4]}>
          <meshStandardMaterial
            color={BUSINESS_COLORS.primary.blue}
            metalness={0.2}
            roughness={0.6}
            emissive={threat ? BUSINESS_COLORS.status.error : undefined}
            emissiveIntensity={threat ? 0.2 : 0}
          />
        </Box>
      )}

      {type === "firewall" && (
        <Box args={[1.2, 0.4, 0.3]}>
          <meshStandardMaterial
            color={BUSINESS_COLORS.status.warning}
            metalness={0.1}
            roughness={0.7}
            emissive={BUSINESS_COLORS.status.warning}
            emissiveIntensity={0.2}
          />
        </Box>
      )}

      {type === "endpoint" && (
        <Sphere args={[0.3, 16, 16]}>
          <meshStandardMaterial
            color={BUSINESS_COLORS.neutral.lightGray}
            metalness={0.1}
            roughness={0.8}
            emissive={threat ? BUSINESS_COLORS.status.error : undefined}
            emissiveIntensity={threat ? 0.3 : 0}
          />
        </Sphere>
      )}

      {/* 状态指示器 */}
      <Sphere args={[0.08]} position={[0, type === "core" ? -0.8 : -0.5, 0]}>
        <meshBasicMaterial
          color={threatColor}
          emissive={threatColor}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* 威胁警告效果 */}
      {threat && (
        <Sphere args={[1.5]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={BUSINESS_COLORS.status.error}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </Sphere>
      )}

      {/* 悬浮标签 */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Html
          position={[0, type === "core" ? 1.5 : 1, 0]}
          center
          distanceFactor={8}
          occlude
        >
          <div
            className="px-2 py-1 rounded-lg text-xs font-medium pointer-events-none"
            style={{
              backgroundColor: `${threatColor}20`,
              color: threatColor,
              border: `1px solid ${threatColor}40`,
              backdropFilter: "blur(4px)",
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>

      {/* 环绕粒子 */}
      {type === "core" && (
        <>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <AnimatedParticle
                key={i}
                position={[x, 0, z]}
                color={BUSINESS_COLORS.primary.blue}
                speed={0.5}
              />
            );
          })}
        </>
      )}
    </group>
  );
}

// 安全防护罩组件
function SecurityShield() {
  const shieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      shieldRef.current.material.opacity =
        0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <mesh ref={shieldRef} position={[0, 1, 0]}>
      <sphereGeometry args={[4.5, 32, 32]} />
      <meshBasicMaterial
        color={BUSINESS_COLORS.primary.blue}
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        wireframe={true}
      />
    </mesh>
  );
}

// 扫描波效果
function ScanWave() {
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waveRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      waveRef.current.scale.setScalar(scale);
      waveRef.current.material.opacity = 0.3 - (scale - 1) * 0.6;
    }
  });

  return (
    <mesh ref={waveRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2, 2.2, 32]} />
      <meshBasicMaterial
        color={BUSINESS_COLORS.primary.lightBlue}
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// 主要的商务风格3D网络安全模型
export function BusinessSecurityModel({
  interactive = true,
}: {
  interactive?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [threatActive, setThreatActive] = useState(false);

  // 模拟威胁检测
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatActive(Math.random() > 0.7);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 缓慢旋转动画
  useFrame((state) => {
    if (groupRef.current && interactive) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  // 网络节点位置和状态
  const networkNodes = useMemo(
    () => [
      {
        position: [0, 0, 0] as [number, number, number],
        type: "core",
        label: "核心服务器",
        status: "online" as const,
        threat: threatActive,
      },
      {
        position: [2, 1, 2] as [number, number, number],
        type: "server",
        label: "应用服务器",
        status: "online" as const,
      },
      {
        position: [-2, 1, 2] as [number, number, number],
        type: "server",
        label: "数据库服务器",
        status: "online" as const,
      },
      {
        position: [2, 1, -2] as [number, number, number],
        type: "server",
        label: "Web服务器",
        status: "online" as const,
      },
      {
        position: [-2, 1, -2] as [number, number, number],
        type: "server",
        label: "文件服务器",
        status: "warning" as const,
      },
      {
        position: [0, 2, 3] as [number, number, number],
        type: "firewall",
        label: "防火墙",
        status: "online" as const,
      },
      {
        position: [3, 0.5, 0] as [number, number, number],
        type: "endpoint",
        label: "工作站A",
        status: "online" as const,
      },
      {
        position: [-3, 0.5, 0] as [number, number, number],
        type: "endpoint",
        label: "工作站B",
        status: "online" as const,
      },
    ],
    [threatActive],
  );

  // 数据流连接
  const dataFlows = useMemo(
    () => [
      {
        start: [0, 0, 0] as [number, number, number],
        end: [2, 1, 2] as [number, number, number],
        color: BUSINESS_COLORS.primary.lightBlue,
        speed: 1.5,
      },
      {
        start: [0, 0, 0] as [number, number, number],
        end: [-2, 1, 2] as [number, number, number],
        color: BUSINESS_COLORS.primary.blue,
        speed: 2,
      },
      {
        start: [0, 2, 3] as [number, number, number],
        end: [3, 0.5, 0] as [number, number, number],
        color: BUSINESS_COLORS.status.success,
        speed: 1,
      },
      {
        start: [0, 2, 3] as [number, number, number],
        end: [-3, 0.5, 0] as [number, number, number],
        color: BUSINESS_COLORS.status.info,
        speed: 1.2,
      },
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
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color={BUSINESS_COLORS.primary.blue}
        distance={20}
      />

      {/* 网络连接线 */}
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.from, connection.to]}
          color={BUSINESS_COLORS.primary.lightBlue}
          lineWidth={2}
          dashed={false}
          transparent
          opacity={0.6}
        />
      ))}

      {/* 数据流粒子 */}
      {dataFlows.map((flow, index) => (
        <DataFlow
          key={index}
          start={flow.start}
          end={flow.end}
          color={flow.color}
          speed={flow.speed}
        />
      ))}

      {/* 网络节点 */}
      {networkNodes.map((node, index) => (
        <NetworkNode
          key={index}
          position={node.position}
          type={node.type}
          label={node.label}
          status={node.status}
          threat={node.threat}
        />
      ))}

      {/* 安全防护罩 */}
      <SecurityShield />

      {/* 扫描波效果 */}
      <ScanWave />

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

      {/* 环境粒子效果 */}
      <Sparkles
        count={50}
        scale={[8, 3, 8]}
        size={1}
        speed={0.2}
        opacity={0.1}
        color={BUSINESS_COLORS.primary.blue}
      />

      {/* 雾效 */}
      <fog
        attach="fog"
        args={[BUSINESS_COLORS.ui.background.secondary, 8, 25]}
      />
    </group>
  );
}

// 简化的商务风格Shield组件
export function BusinessShield({
  animated = true,
  status = "protected",
}: {
  animated?: boolean;
  status?: "protected" | "vulnerable" | "scanning";
}) {
  const meshRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);

  const statusColors = {
    protected: BUSINESS_COLORS.status.success,
    vulnerable: BUSINESS_COLORS.status.error,
    scanning: BUSINESS_COLORS.status.warning,
  };

  const currentColor = statusColors[status];

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (shieldRef.current) {
      shieldRef.current.material.emissiveIntensity =
        0.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.3} color={currentColor} />

      {/* 主盾牌 */}
      <mesh ref={shieldRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.3, 6]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary.blue}
          metalness={0.4}
          roughness={0.3}
          emissive={currentColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 中心标志 */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.neutral.white}
          metalness={0.2}
          roughness={0.4}
          emissive={currentColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 防护层 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color={currentColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 环绕能量环 */}
      {Array.from({ length: 3 }).map((_, i) => {
        const radius = 2.5 + i * 0.5;
        return (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}
          >
            <torusGeometry args={[radius, 0.05, 8, 32]} />
            <meshBasicMaterial
              color={currentColor}
              transparent
              opacity={0.6 - i * 0.2}
            />
          </mesh>
        );
      })}

      {/* 状态指示粒子 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <AnimatedParticle
            key={i}
            position={[x, 0, z]}
            color={currentColor}
            speed={1 + i * 0.1}
          />
        );
      })}

      {/* 状态文本 */}
      <Html center distanceFactor={10}>
        <div
          className="text-center px-3 py-1 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: `${currentColor}20`,
            color: currentColor,
            border: `1px solid ${currentColor}40`,
            backdropFilter: "blur(4px)",
          }}
        >
          {status === "protected" && "系统受保护"}
          {status === "vulnerable" && "发现威胁"}
          {status === "scanning" && "扫描中..."}
        </div>
      </Html>
    </group>
  );
}

// 商务风格网络拓扑图
export function BusinessNetworkTopology({
  animated = true,
  showTraffic = true,
}: {
  animated?: boolean;
  showTraffic?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && animated) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.7} />
      <pointLight
        position={[0, 3, 0]}
        intensity={0.4}
        color={BUSINESS_COLORS.primary.blue}
      />

      {/* 核心交换机 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial
          color={BUSINESS_COLORS.primary.navy}
          metalness={0.3}
          roughness={0.4}
          emissive={BUSINESS_COLORS.primary.blue}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 核心指示器 */}
      <Billboard follow={true}>
        <Html center distanceFactor={8}>
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: `${BUSINESS_COLORS.primary.navy}20`,
              color: BUSINESS_COLORS.primary.navy,
              border: `1px solid ${BUSINESS_COLORS.primary.navy}40`,
            }}
          >
            核心交换机
          </div>
        </Html>
      </Billboard>

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
                emissive={BUSINESS_COLORS.primary.lightBlue}
                emissiveIntensity={0.05}
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
              transparent
              opacity={0.7}
            />

            {/* 数据流效果 */}
            {showTraffic && (
              <DataFlow
                start={[0, 0, 0]}
                end={[x, 0, z]}
                color={BUSINESS_COLORS.status.success}
                speed={1 + i * 0.2}
              />
            )}
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
          <group key={i}>
            <mesh position={[x, 0, z]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial
                color={BUSINESS_COLORS.neutral.lightGray}
                metalness={0.1}
                roughness={0.8}
                emissive={BUSINESS_COLORS.status.info}
                emissiveIntensity={0.05}
              />
            </mesh>

            {/* 终端状态指示 */}
            <mesh position={[x, 0.3, z]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial
                color={
                  i % 4 === 0
                    ? BUSINESS_COLORS.status.warning
                    : BUSINESS_COLORS.status.success
                }
                emissive={
                  i % 4 === 0
                    ? BUSINESS_COLORS.status.warning
                    : BUSINESS_COLORS.status.success
                }
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* 网络覆盖范围 */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[5, 5, 0.05, 32]} />
        <meshBasicMaterial
          color={BUSINESS_COLORS.primary.blue}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}
