import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sphere, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { BUSINESS_COLORS } from "@/lib/businessColors";

// 动画粒子组件 - 增强版本
function AnimatedParticle({
  position,
  color,
  speed = 1,
  size = 0.02,
  opacity = 1,
  pulseIntensity = 0.5,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  size?: number;
  opacity?: number;
  pulseIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [offset] = useState(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y =
        position[1] + Math.sin(time * speed + offset) * 0.5;

      // 脉冲效果
      const pulseScale = 1 + Math.sin(time * 3 + offset) * pulseIntensity;
      meshRef.current.scale.setScalar(pulseScale);

      // 透明度动画
      if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
        meshRef.current.material.opacity =
          opacity * (0.6 + Math.sin(time * 2 + offset) * 0.4);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// 连接线组件 - 增强版本
function EnhancedLineConnection({
  start,
  end,
  color,
  animated = true,
  intensity = 1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  animated?: boolean;
  intensity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (animated && pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      if (pulseRef.current.material instanceof THREE.MeshBasicMaterial) {
        pulseRef.current.material.opacity = pulse * intensity;
      }
    }
  });

  // 计算连接点
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const distance = startVec.distanceTo(endVec);
    const numPoints = Math.max(6, Math.floor(distance * 3));

    return Array.from({ length: numPoints }, (_, i) => {
      const t = i / (numPoints - 1);
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t;
      const z = start[2] + (end[2] - start[2]) * t;
      return [x, y, z] as [number, number, number];
    });
  }, [start, end]);

  return (
    <group ref={groupRef}>
      {/* 主连接线 */}
      {points.map((point, i) => (
        <mesh key={i} position={point}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.8 * intensity}
          />
        </mesh>
      ))}

      {/* 脉冲效果 */}
      {animated && (
        <mesh ref={pulseRef} position={points[Math.floor(points.length / 2)]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// 数据流粒子 - 增强版本
function EnhancedDataFlow({
  start,
  end,
  color,
  speed = 2,
  particleCount = 5,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
  particleCount?: number;
}) {
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const trailRefs = useRef<THREE.Mesh[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    particleRefs.current.forEach((particle, index) => {
      if (particle) {
        const offset = (index / particleCount) * Math.PI * 2;
        const t = (Math.sin(state.clock.elapsedTime * speed + offset) + 1) / 2;

        const currentPos = new THREE.Vector3().lerpVectors(
          new THREE.Vector3(...start),
          new THREE.Vector3(...end),
          t,
        );

        particle.position.copy(currentPos);
        particle.scale.setScalar(
          0.5 + Math.sin(state.clock.elapsedTime * 4 + offset) * 0.3,
        );

        // 更新尾迹
        trailRefs.current.forEach((trail, trailIndex) => {
          if (trail && trailIndex === index) {
            const trailT = Math.max(0, t - 0.15);
            const trailPos = new THREE.Vector3().lerpVectors(
              new THREE.Vector3(...start),
              new THREE.Vector3(...end),
              trailT,
            );
            trail.position.copy(trailPos);
            trail.scale.setScalar(0.3);

            if (trail.material instanceof THREE.MeshBasicMaterial) {
              trail.material.opacity = Math.max(0, 0.5 - (t - trailT) * 2);
            }
          }
        });
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* 主粒子 */}
      {Array.from({ length: particleCount }).map((_, index) => (
        <mesh
          key={`particle-${index}`}
          ref={(el) => {
            if (el) particleRefs.current[index] = el;
          }}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* 尾迹粒子 */}
      {Array.from({ length: particleCount }).map((_, index) => (
        <mesh
          key={`trail-${index}`}
          ref={(el) => {
            if (el) trailRefs.current[index] = el;
          }}
        >
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// 网络节点组件 - 增强版本
function EnhancedNetworkNode({
  position,
  type,
  label,
  status = "online",
  threat = false,
  load = 0,
  connections = 0,
}: {
  position: [number, number, number];
  type: string;
  label: string;
  status?: "online" | "offline" | "warning" | "error";
  threat?: boolean;
  load?: number;
  connections?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const statusColors = {
    online: BUSINESS_COLORS.status.success,
    offline: BUSINESS_COLORS.neutral.silver,
    warning: BUSINESS_COLORS.status.warning,
    error: BUSINESS_COLORS.status.error,
  };

  const threatColor = threat
    ? BUSINESS_COLORS.status.error
    : statusColors[status];

  // 负载颜色
  const loadColor = useMemo(() => {
    if (load < 30) return BUSINESS_COLORS.status.success;
    if (load < 70) return BUSINESS_COLORS.status.warning;
    return BUSINESS_COLORS.status.error;
  }, [load]);

  useFrame((state) => {
    if (meshRef.current) {
      // 基础旋转
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // 威胁警告动画
      if (threat) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }

      // 悬停效果
      if (hovered) {
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.position.y = position[1];
      }
    }
  });

  // 随机脉冲效果
  useEffect(() => {
    const interval = setInterval(
      () => {
        setPulsing(true);
        setTimeout(() => setPulsing(false), 500);
      },
      3000 + Math.random() * 5000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 主要几何体 */}
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
          {/* 数据访问指示器 */}
          <Sphere args={[1.4]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={BUSINESS_COLORS.primary.lightBlue}
              transparent
              opacity={pulsing ? 0.3 : 0.05}
              side={THREE.DoubleSide}
            />
          </Sphere>
        </>
      )}

      {type === "server" && (
        <>
          <Box args={[0.6, 0.8, 0.4]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.primary.blue}
              metalness={0.2}
              roughness={0.6}
              emissive={threat ? BUSINESS_COLORS.status.error : undefined}
              emissiveIntensity={threat ? 0.2 : 0}
            />
          </Box>
          {/* 负载指示器 */}
          <Box
            args={[0.7, (load / 100) * 0.8, 0.1]}
            position={[0, -0.4 + (load / 100) * 0.4, 0.3]}
          >
            <meshBasicMaterial color={loadColor} transparent opacity={0.7} />
          </Box>
        </>
      )}

      {type === "firewall" && (
        <>
          <Box args={[1.2, 0.4, 0.3]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.status.warning}
              metalness={0.1}
              roughness={0.7}
              emissive={BUSINESS_COLORS.status.warning}
              emissiveIntensity={0.2}
            />
          </Box>
          {/* 防护屏障效果 */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Sphere key={i} args={[1.5 + i * 0.2]} position={[0, 0, 0]}>
              <meshBasicMaterial
                color={BUSINESS_COLORS.status.warning}
                transparent
                opacity={0.05 - i * 0.01}
                side={THREE.DoubleSide}
              />
            </Sphere>
          ))}
        </>
      )}

      {type === "endpoint" && (
        <>
          <Sphere args={[0.3, 16, 16]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.neutral.lightGray}
              metalness={0.1}
              roughness={0.8}
              emissive={threat ? BUSINESS_COLORS.status.error : undefined}
              emissiveIntensity={threat ? 0.3 : 0}
            />
          </Sphere>
          {/* 连接数指示器 */}
          {Array.from({ length: Math.min(connections, 4) }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2;
            const radius = 0.5;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial color={BUSINESS_COLORS.primary.lightBlue} />
              </mesh>
            );
          })}
        </>
      )}

      {type === "database" && (
        <>
          <Cylinder args={[0.5, 0.5, 0.8, 12]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.neutral.gray}
              metalness={0.4}
              roughness={0.3}
              emissive={
                threat
                  ? BUSINESS_COLORS.status.error
                  : BUSINESS_COLORS.primary.blue
              }
              emissiveIntensity={threat ? 0.2 : 0.05}
            />
          </Cylinder>
          {/* 数据层指示器 */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Cylinder
              key={i}
              args={[0.52, 0.52, 0.05, 12]}
              position={[0, -0.2 + i * 0.2, 0]}
            >
              <meshBasicMaterial
                color={BUSINESS_COLORS.primary.lightBlue}
                transparent
                opacity={0.6}
              />
            </Cylinder>
          ))}
        </>
      )}

      {type === "router" && (
        <>
          <Box args={[0.8, 0.3, 0.8]}>
            <meshStandardMaterial
              color={BUSINESS_COLORS.primary.lightBlue}
              metalness={0.2}
              roughness={0.5}
              emissive={threat ? BUSINESS_COLORS.status.error : undefined}
              emissiveIntensity={threat ? 0.2 : 0}
            />
          </Box>
          {/* 路由信号指示器 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 0.6;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  0.2,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.03, 4, 4]} />
                <meshBasicMaterial
                  color={BUSINESS_COLORS.status.success}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </>
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
        <>
          <Sphere args={[1.5]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={BUSINESS_COLORS.status.error}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </Sphere>
          {/* 威胁警告脉冲 */}
          <Sphere args={[2.0]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={BUSINESS_COLORS.status.error}
              transparent
              opacity={0.05}
              side={THREE.DoubleSide}
            />
          </Sphere>
        </>
      )}

      {/* 状态指示器增强版 */}
      <Sphere args={[0.15]} position={[0, type === "core" ? 1.5 : 1.0, 0]}>
        <meshBasicMaterial color={threatColor} transparent opacity={0.8} />
      </Sphere>

      {/* 负载环形指示器 */}
      {load > 0 && (
        <mesh
          position={[0, type === "core" ? 1.8 : 1.3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry
            args={[0.2, 0.25, 16, 1, 0, (load / 100) * Math.PI * 2]}
          />
          <meshBasicMaterial color={loadColor} transparent opacity={0.7} />
        </mesh>
      )}

      {/* 环绕粒子 */}
      {type === "core" && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <AnimatedParticle
                key={i}
                position={[x, 0, z]}
                color={BUSINESS_COLORS.primary.blue}
                speed={0.5}
                size={0.025}
                pulseIntensity={0.3}
              />
            );
          })}
        </>
      )}

      {/* 数据流效果 */}
      {connections > 0 && status === "online" && (
        <>
          {Array.from({ length: Math.min(connections, 3) }).map((_, i) => {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 1.2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return (
              <AnimatedParticle
                key={`flow-${i}`}
                position={[x, 0.5, z]}
                color={BUSINESS_COLORS.primary.lightBlue}
                speed={1 + i * 0.3}
                size={0.015}
                opacity={0.6}
                pulseIntensity={0.5}
              />
            );
          })}
        </>
      )}
    </group>
  );
}

// 安全防护罩组件 - 增强版本
function EnhancedSecurityShield() {
  const shieldRef = useRef<THREE.Mesh>(null);
  const innerShieldRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      shieldRef.current.material.opacity =
        0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }

    if (innerShieldRef.current) {
      innerShieldRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
      innerShieldRef.current.material.opacity =
        0.05 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
    }
  });

  return (
    <group>
      {/* 外层防护罩 */}
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

      {/* 内层防护罩 */}
      <mesh ref={innerShieldRef} position={[0, 1, 0]}>
        <sphereGeometry args={[3.8, 24, 24]} />
        <meshBasicMaterial
          color={BUSINESS_COLORS.primary.lightBlue}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          wireframe={true}
        />
      </mesh>

      {/* 防护节点 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        const radius = 4.5;

        return (
          <AnimatedParticle
            key={i}
            position={[
              radius * Math.cos(theta) * Math.sin(phi),
              radius * Math.cos(phi) + 1,
              radius * Math.sin(theta) * Math.sin(phi),
            ]}
            color={BUSINESS_COLORS.primary.blue}
            speed={0.3}
            size={0.03}
            opacity={0.8}
            pulseIntensity={0.4}
          />
        );
      })}
    </group>
  );
}

// 扫描波效果 - 增强版本
function EnhancedScanWave() {
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    waveRefs.current.forEach((wave, index) => {
      if (wave) {
        const offset = index * 0.5;
        const scale =
          1 + Math.sin(state.clock.elapsedTime * 1.5 + offset) * 0.8;
        wave.scale.setScalar(scale);

        if (wave.material instanceof THREE.MeshBasicMaterial) {
          wave.material.opacity = Math.max(0, 0.4 - (scale - 1) * 0.6);
        }
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) waveRefs.current[i] = el;
          }}
          position={[0, 0.1 + i * 0.05, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[2, 2.3, 32]} />
          <meshBasicMaterial
            color={BUSINESS_COLORS.primary.lightBlue}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// 主要的商务风格3D网络安全模型 - 增强版本
export function BusinessSecurityModel({
  interactive = true,
  showTraffic = true,
  threatSimulation = false,
  modelComplexity = "high",
}: {
  interactive?: boolean;
  showTraffic?: boolean;
  threatSimulation?: boolean;
  modelComplexity?: "low" | "medium" | "high";
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [threatActive, setThreatActive] = useState(false);
  const [networkActivity, setNetworkActivity] = useState(0.5);

  // 模拟威胁检测
  useEffect(() => {
    if (threatSimulation) {
      const interval = setInterval(() => {
        setThreatActive(Math.random() > 0.8);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [threatSimulation]);

  // 网络活动模拟
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkActivity(Math.random() * 0.6 + 0.2);
    }, 2000);
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
  const networkNodes = useMemo(() => {
    const baseNodes = [
      {
        position: [0, 0, 0] as [number, number, number],
        type: "core",
        label: "核心服务器",
        status: "online" as const,
        threat: threatActive,
        load: 45 + Math.random() * 20,
        connections: 4,
      },
      {
        position: [2, 1, 2] as [number, number, number],
        type: "server",
        label: "应用服务器",
        status: "online" as const,
        load: 65 + Math.random() * 15,
        connections: 2,
      },
      {
        position: [-2, 1, 2] as [number, number, number],
        type: "database",
        label: "数据库集群",
        status: "online" as const,
        load: 35 + Math.random() * 25,
        connections: 3,
      },
      {
        position: [2, 1, -2] as [number, number, number],
        type: "server",
        label: "Web服务器",
        status: "online" as const,
        load: 50 + Math.random() * 30,
        connections: 2,
      },
      {
        position: [-2, 1, -2] as [number, number, number],
        type: "server",
        label: "文件服务器",
        status: "warning" as const,
        load: 80 + Math.random() * 15,
        connections: 1,
      },
      {
        position: [0, 2, 3] as [number, number, number],
        type: "firewall",
        label: "防火墙集群",
        status: "online" as const,
        load: 25 + Math.random() * 20,
        connections: 4,
      },
      {
        position: [3, 0.5, 0] as [number, number, number],
        type: "endpoint",
        label: "终端设备群A",
        status: "online" as const,
        load: 20 + Math.random() * 15,
        connections: 1,
      },
      {
        position: [-3, 0.5, 0] as [number, number, number],
        type: "endpoint",
        label: "终端设备群B",
        status: "online" as const,
        load: 15 + Math.random() * 20,
        connections: 1,
      },
    ];

    // 根据复杂度调整节点数量
    if (modelComplexity === "high") {
      baseNodes.push(
        {
          position: [0, -1, -3] as [number, number, number],
          type: "router",
          label: "边界路由器",
          status: "online" as const,
          load: 30 + Math.random() * 20,
          connections: 3,
        },
        {
          position: [1.5, 2.5, 1.5] as [number, number, number],
          type: "server",
          label: "备份服务器",
          status: "online" as const,
          load: 10 + Math.random() * 15,
          connections: 1,
        },
      );
    }

    return baseNodes;
  }, [threatActive, modelComplexity]);

  // 数据流连接
  const dataFlows = useMemo(() => {
    const baseFlows = [
      {
        start: [0, 0, 0] as [number, number, number],
        end: [2, 1, 2] as [number, number, number],
        color: BUSINESS_COLORS.primary.lightBlue,
        speed: 1.5 * networkActivity,
      },
      {
        start: [0, 0, 0] as [number, number, number],
        end: [-2, 1, 2] as [number, number, number],
        color: BUSINESS_COLORS.primary.blue,
        speed: 2 * networkActivity,
      },
      {
        start: [0, 2, 3] as [number, number, number],
        end: [3, 0.5, 0] as [number, number, number],
        color: BUSINESS_COLORS.status.success,
        speed: 1 * networkActivity,
      },
      {
        start: [0, 2, 3] as [number, number, number],
        end: [-3, 0.5, 0] as [number, number, number],
        color: BUSINESS_COLORS.status.info,
        speed: 1.2 * networkActivity,
      },
    ];

    if (modelComplexity === "high") {
      baseFlows.push({
        start: [0, 0, 0] as [number, number, number],
        end: [0, -1, -3] as [number, number, number],
        color: BUSINESS_COLORS.primary.navy,
        speed: 0.8 * networkActivity,
      });
    }

    return baseFlows;
  }, [networkActivity, modelComplexity]);

  // 连接线
  const connections = useMemo(() => {
    const baseConnections = [
      { from: [0, 0, 0], to: [2, 1, 2] },
      { from: [0, 0, 0], to: [-2, 1, 2] },
      { from: [0, 0, 0], to: [2, 1, -2] },
      { from: [0, 0, 0], to: [-2, 1, -2] },
      { from: [0, 0, 0], to: [0, 2, 3] },
      { from: [0, 2, 3], to: [3, 0.5, 0] },
      { from: [0, 2, 3], to: [-3, 0.5, 0] },
    ];

    if (modelComplexity === "high") {
      baseConnections.push(
        { from: [0, 0, 0], to: [0, -1, -3] },
        { from: [0, -1, -3], to: [3, 0.5, 0] },
        { from: [0, -1, -3], to: [-3, 0.5, 0] },
        { from: [2, 1, 2], to: [1.5, 2.5, 1.5] },
      );
    }

    return baseConnections;
  }, [modelComplexity]);

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

      {/* 额外的动态光源 */}
      <pointLight
        position={[5, 3, 5]}
        intensity={0.3 + Math.sin(Date.now() * 0.002) * 0.1}
        color={BUSINESS_COLORS.primary.lightBlue}
        distance={15}
      />

      {/* 网络连接线 */}
      {connections.map((connection, index) => (
        <EnhancedLineConnection
          key={index}
          start={connection.from}
          end={connection.to}
          color={BUSINESS_COLORS.primary.lightBlue}
          animated={showTraffic}
          intensity={networkActivity}
        />
      ))}

      {/* 数据流粒子 */}
      {showTraffic &&
        dataFlows.map((flow, index) => (
          <EnhancedDataFlow
            key={index}
            start={flow.start}
            end={flow.end}
            color={flow.color}
            speed={flow.speed}
            particleCount={modelComplexity === "high" ? 3 : 2}
          />
        ))}

      {/* 网络节点 */}
      {networkNodes.map((node, index) => (
        <EnhancedNetworkNode
          key={index}
          position={node.position}
          type={node.type}
          label={node.label}
          status={node.status}
          threat={node.threat}
          load={node.load}
          connections={node.connections}
        />
      ))}

      {/* 安全防护罩 */}
      <EnhancedSecurityShield />

      {/* 扫描波效果 */}
      <EnhancedScanWave />

      {/* 环境粒子效果 */}
      {modelComplexity !== "low" &&
        Array.from({ length: modelComplexity === "high" ? 30 : 20 }).map(
          (_, i) => {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 8;
            const z = (Math.random() - 0.5) * 20;
            return (
              <AnimatedParticle
                key={i}
                position={[x, y, z]}
                color={BUSINESS_COLORS.primary.blue}
                speed={0.2 + Math.random() * 0.3}
                size={0.01 + Math.random() * 0.01}
                opacity={0.3 + Math.random() * 0.3}
                pulseIntensity={0.2}
              />
            );
          },
        )}

      {/* 威胁检测效果 */}
      {threatActive && (
        <group>
          {/* 威胁警告光束 */}
          <mesh position={[0, 5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.2, 10, 8]} />
            <meshBasicMaterial
              color={BUSINESS_COLORS.status.error}
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* 威胁扫描环 */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5, 5.5, 32]} />
            <meshBasicMaterial
              color={BUSINESS_COLORS.status.error}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      )}

      {/* 雾效 */}
      <fog
        attach="fog"
        args={[BUSINESS_COLORS.ui.background.secondary, 8, 30]}
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
  const [intensity, setIntensity] = useState(1);

  const statusColors = {
    protected: BUSINESS_COLORS.status.success,
    vulnerable: BUSINESS_COLORS.status.error,
    scanning: BUSINESS_COLORS.status.warning,
  };

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;

      if (status === "scanning") {
        setIntensity(0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5);
      } else {
        setIntensity(1);
      }
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          color={statusColors[status]}
          transparent
          opacity={0.3 * intensity}
          emissive={statusColors[status]}
          emissiveIntensity={0.1 * intensity}
        />
      </Sphere>

      {/* 防护层 */}
      <Sphere args={[2.2, 16, 16]}>
        <meshBasicMaterial
          color={statusColors[status]}
          transparent
          opacity={0.1 * intensity}
          wireframe
        />
      </Sphere>

      {/* 中心核心 */}
      <Sphere args={[0.5]}>
        <meshStandardMaterial
          color={statusColors[status]}
          emissive={statusColors[status]}
          emissiveIntensity={0.5 * intensity}
        />
      </Sphere>
    </group>
  );
}

// 网络拓扑组件
export function BusinessNetworkTopology({
  scale = 1,
  showLabels = true,
}: {
  scale?: number;
  showLabels?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* 核心交换机 */}
      <EnhancedNetworkNode
        position={[0, 0, 0]}
        type="core"
        label="核心交换机"
        status="online"
        load={45}
        connections={6}
      />

      {/* 分布式服务器 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <EnhancedNetworkNode
            key={i}
            position={[x, 0, z]}
            type="server"
            label={`服务器 ${i + 1}`}
            status="online"
            load={30 + Math.random() * 40}
            connections={2}
          />
        );
      })}

      {/* 连接线 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <EnhancedLineConnection
            key={i}
            start={[0, 0, 0]}
            end={[x, 0, z]}
            color={BUSINESS_COLORS.primary.blue}
            animated={true}
          />
        );
      })}
    </group>
  );
}
