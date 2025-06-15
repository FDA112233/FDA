import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Box,
  Cylinder,
  Cone,
  Torus,
  Dodecahedron,
} from "@react-three/drei";
import * as THREE from "three";
import { BUSINESS_COLORS } from "@/lib/businessColors";

// 类型定义
interface NetworkNode {
  id: string;
  position: [number, number, number];
  type:
    | "core"
    | "server"
    | "firewall"
    | "router"
    | "endpoint"
    | "database"
    | "cloud"
    | "edge";
  status: "online" | "offline" | "warning" | "error" | "maintenance";
  load: number;
  connections: string[];
  threatLevel: "safe" | "low" | "medium" | "high" | "critical";
  lastActivity: Date;
  dataFlow: number;
}

interface ThreatEvent {
  id: string;
  source: [number, number, number];
  target: [number, number, number];
  type: "ddos" | "malware" | "intrusion" | "phishing" | "ransomware";
  severity: "low" | "medium" | "high" | "critical";
  active: boolean;
  timestamp: Date;
}

interface SecurityShieldConfig {
  enabled: boolean;
  strength: number;
  coverage: number;
  activeDefenses: string[];
}

// 增强动画粒子组件
const EnhancedParticle = React.memo(
  ({
    position,
    color,
    size = 0.02,
    speed = 1,
    behavior = "float",
    intensity = 1,
  }: {
    position: [number, number, number];
    color: string;
    size?: number;
    speed?: number;
    behavior?: "float" | "pulse" | "orbit" | "spiral" | "data";
    intensity?: number;
  }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [offset] = useState(Math.random() * Math.PI * 2);
    const [direction] = useState(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
      ),
    );

    useFrame((state) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;
      const basePos = new THREE.Vector3(...position);

      switch (behavior) {
        case "float":
          meshRef.current.position.y =
            basePos.y + Math.sin(time * speed + offset) * 0.3;
          meshRef.current.position.x =
            basePos.x + Math.cos(time * speed * 0.7 + offset) * 0.1;
          break;

        case "pulse":
          const pulse = 1 + Math.sin(time * speed * 3 + offset) * 0.5;
          meshRef.current.scale.setScalar(pulse);
          break;

        case "orbit":
          const radius = 0.5;
          const angle = time * speed + offset;
          meshRef.current.position.x = basePos.x + Math.cos(angle) * radius;
          meshRef.current.position.z = basePos.z + Math.sin(angle) * radius;
          meshRef.current.position.y = basePos.y + Math.sin(angle * 2) * 0.2;
          break;

        case "spiral":
          const spiralAngle = time * speed + offset;
          const spiralRadius = 0.3 + Math.sin(time * 0.5) * 0.2;
          meshRef.current.position.x =
            basePos.x + Math.cos(spiralAngle) * spiralRadius;
          meshRef.current.position.z =
            basePos.z + Math.sin(spiralAngle) * spiralRadius;
          meshRef.current.position.y =
            basePos.y + ((spiralAngle * 0.1) % 2) - 1;
          break;

        case "data":
          meshRef.current.position.add(direction);
          const opacity = Math.sin(time * speed * 2 + offset) * 0.5 + 0.5;
          if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
            meshRef.current.material.opacity = opacity * intensity;
          }
          break;
      }

      // 通用脉冲效果
      if (
        behavior !== "pulse" &&
        meshRef.current.material instanceof THREE.MeshBasicMaterial
      ) {
        meshRef.current.material.opacity =
          intensity * (0.7 + Math.sin(time * 2 + offset) * 0.3);
      }
    });

    return (
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={intensity} />
      </mesh>
    );
  },
);

// 高级数据流组件
const AdvancedDataFlow = React.memo(
  ({
    start,
    end,
    color,
    speed = 1,
    intensity = 1,
    flowType = "standard",
    particleCount = 3,
  }: {
    start: [number, number, number];
    end: [number, number, number];
    color: string;
    speed?: number;
    intensity?: number;
    flowType?: "standard" | "encrypted" | "threat" | "backup";
    particleCount?: number;
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Mesh[]>([]);

    const flowColors = {
      standard: color,
      encrypted: BUSINESS_COLORS.status.success,
      threat: BUSINESS_COLORS.threat.critical,
      backup: BUSINESS_COLORS.status.info,
    };

    const flowColor = flowColors[flowType] || color;

    useFrame((state) => {
      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;

        const offset = (index / particleCount) * Math.PI * 2;
        const t = (Math.sin(state.clock.elapsedTime * speed + offset) + 1) / 2;

        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);

        // 创建贝塞尔曲线路径
        const mid = startVec.clone().lerp(endVec, 0.5);
        mid.y += Math.sin(offset) * 0.5; // 添加弧度

        const currentPos = new THREE.Vector3();
        currentPos
          .copy(startVec)
          .lerp(mid, t * 2)
          .lerp(endVec, Math.max(0, t * 2 - 1));

        particle.position.copy(currentPos);

        // 根据流类型调整大小和效果
        const baseScale =
          flowType === "threat"
            ? 0.6 + Math.sin(state.clock.elapsedTime * 8) * 0.4
            : 1;
        particle.scale.setScalar(
          baseScale *
            (0.5 + Math.sin(state.clock.elapsedTime * 4 + offset) * 0.3),
        );

        // 透明度变化
        if (particle.material instanceof THREE.MeshBasicMaterial) {
          particle.material.opacity =
            intensity *
            (0.8 + Math.sin(state.clock.elapsedTime * 3 + offset) * 0.2);
        }
      });
    });

    return (
      <group ref={groupRef}>
        {Array.from({ length: particleCount }).map((_, index) => (
          <mesh
            key={index}
            ref={(el) => {
              if (el) particlesRef.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={flowColor} transparent />
          </mesh>
        ))}
      </group>
    );
  },
);

// 高级网络节点组件
const AdvancedNetworkNode = React.memo(
  ({
    node,
    isSelected = false,
    onSelect,
    threatEvents = [],
  }: {
    node: NetworkNode;
    isSelected?: boolean;
    onSelect?: (nodeId: string) => void;
    threatEvents?: ThreatEvent[];
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [pulsing, setPulsing] = useState(false);

    const statusColors = {
      online: BUSINESS_COLORS.status.success,
      offline: BUSINESS_COLORS.neutral[600],
      warning: BUSINESS_COLORS.status.warning,
      error: BUSINESS_COLORS.status.error,
      maintenance: BUSINESS_COLORS.status.info,
    };

    const threatColors = {
      safe: BUSINESS_COLORS.threat.safe,
      low: BUSINESS_COLORS.threat.low,
      medium: BUSINESS_COLORS.threat.medium,
      high: BUSINESS_COLORS.threat.high,
      critical: BUSINESS_COLORS.threat.critical,
    };

    const nodeColor = statusColors[node.status];
    const threatColor = threatColors[node.threatLevel];

    // 检查是否有活跃威胁
    const hasActiveThreat = threatEvents.some(
      (threat) =>
        threat.active &&
        (threat.target.toString() === node.position.toString() ||
          threat.source.toString() === node.position.toString()),
    );

    useFrame((state) => {
      if (!groupRef.current) return;

      const time = state.clock.elapsedTime;

      // 基础旋转
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;

      // 威胁警告动画
      if (hasActiveThreat || node.threatLevel === "critical") {
        const scale = 1 + Math.sin(time * 8) * 0.15;
        groupRef.current.scale.setScalar(scale);
      } else {
        groupRef.current.scale.setScalar(isSelected ? 1.1 : 1);
      }

      // 悬停和选中效果
      const targetY =
        node.position[1] +
        (isHovered || isSelected ? Math.sin(time * 3) * 0.1 : 0);
      groupRef.current.position.y +=
        (targetY - groupRef.current.position.y) * 0.1;

      // 负载脉冲
      if (node.load > 80) {
        setPulsing(Math.sin(time * 4) > 0.5);
      }
    });

    // 点击处理
    const handleClick = useCallback(() => {
      onSelect?.(node.id);
    }, [node.id, onSelect]);

    const renderNodeGeometry = () => {
      const commonProps = {
        onPointerOver: () => setIsHovered(true),
        onPointerOut: () => setIsHovered(false),
        onClick: handleClick,
      };

      switch (node.type) {
        case "core":
          return (
            <group {...commonProps}>
              <Dodecahedron args={[0.8]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.dark}
                  metalness={0.8}
                  roughness={0.2}
                  emissive={threatColor}
                  emissiveIntensity={hasActiveThreat ? 0.4 : 0.1}
                />
              </Dodecahedron>
              {/* 核心环绕效果 */}
              <Torus args={[1.2, 0.1, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial
                  color={nodeColor}
                  transparent
                  opacity={0.6}
                />
              </Torus>
            </group>
          );

        case "server":
          return (
            <group {...commonProps}>
              <Box args={[0.6, 1, 0.4]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.main}
                  metalness={0.3}
                  roughness={0.4}
                  emissive={hasActiveThreat ? threatColor : undefined}
                  emissiveIntensity={hasActiveThreat ? 0.3 : 0}
                />
              </Box>
              {/* 服务器指示灯 */}
              {Array.from({ length: 3 }).map((_, i) => (
                <Sphere
                  key={i}
                  args={[0.03]}
                  position={[0.35, 0.3 - i * 0.2, 0.25]}
                >
                  <meshBasicMaterial
                    color={
                      i < Math.ceil(node.load / 40)
                        ? nodeColor
                        : BUSINESS_COLORS.neutral[500]
                    }
                  />
                </Sphere>
              ))}
            </group>
          );

        case "firewall":
          return (
            <group {...commonProps}>
              <Box args={[1.4, 0.4, 0.3]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.status.warning}
                  metalness={0.1}
                  roughness={0.7}
                  emissive={BUSINESS_COLORS.status.warning}
                  emissiveIntensity={0.2}
                />
              </Box>
              {/* 防护屏障 */}
              {Array.from({ length: 3 }).map((_, i) => (
                <Sphere key={i} args={[1.5 + i * 0.3]} position={[0, 0, 0]}>
                  <meshBasicMaterial
                    color={nodeColor}
                    transparent
                    opacity={0.05 - i * 0.01}
                    side={THREE.DoubleSide}
                  />
                </Sphere>
              ))}
            </group>
          );

        case "router":
          return (
            <group {...commonProps}>
              <Cylinder args={[0.5, 0.7, 0.4, 8]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.light}
                  metalness={0.4}
                  roughness={0.3}
                />
              </Cylinder>
              {/* 路由天线 */}
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i / 4) * Math.PI * 2;
                return (
                  <group key={i} rotation={[0, angle, 0]}>
                    <Cylinder args={[0.02, 0.02, 0.8]} position={[0.6, 0.4, 0]}>
                      <meshBasicMaterial color={nodeColor} />
                    </Cylinder>
                  </group>
                );
              })}
            </group>
          );

        case "database":
          return (
            <group {...commonProps}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Cylinder
                  key={i}
                  args={[0.5, 0.5, 0.2]}
                  position={[0, -0.3 + i * 0.25, 0]}
                >
                  <meshStandardMaterial
                    color={BUSINESS_COLORS.neutral[700]}
                    metalness={0.6}
                    roughness={0.2}
                    emissive={
                      i === 0 && node.dataFlow > 0.5
                        ? BUSINESS_COLORS.primary.accent
                        : undefined
                    }
                    emissiveIntensity={0.3}
                  />
                </Cylinder>
              ))}
            </group>
          );

        case "cloud":
          return (
            <group {...commonProps}>
              {/* 云朵形状 */}
              <Sphere args={[0.4]} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.lightest}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
              <Sphere args={[0.3]} position={[-0.3, 0, 0]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.lightest}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
              <Sphere args={[0.3]} position={[0.3, 0, 0]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.primary.lightest}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            </group>
          );

        case "endpoint":
        default:
          return (
            <group {...commonProps}>
              <Sphere args={[0.3, 16, 16]}>
                <meshStandardMaterial
                  color={BUSINESS_COLORS.neutral[500]}
                  metalness={0.1}
                  roughness={0.8}
                  emissive={hasActiveThreat ? threatColor : undefined}
                  emissiveIntensity={hasActiveThreat ? 0.4 : 0}
                />
              </Sphere>
              {/* 连接指示器 */}
              {node.connections.slice(0, 4).map((_, i) => {
                const angle = (i / 4) * Math.PI * 2;
                return (
                  <Sphere
                    key={i}
                    args={[0.05]}
                    position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
                  >
                    <meshBasicMaterial color={nodeColor} />
                  </Sphere>
                );
              })}
            </group>
          );
      }
    };

    return (
      <group ref={groupRef} position={node.position}>
        {renderNodeGeometry()}

        {/* 状态指示器 */}
        <Sphere args={[0.08]} position={[0, -0.7, 0]}>
          <meshBasicMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* 威胁等级指示器 */}
        {node.threatLevel !== "safe" && (
          <Cone args={[0.1, 0.2]} position={[0, 0.8, 0]}>
            <meshBasicMaterial
              color={threatColor}
              emissive={threatColor}
              emissiveIntensity={pulsing ? 0.8 : 0.4}
            />
          </Cone>
        )}

        {/* 负载环形指示器 */}
        {node.load > 0 && (
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[0.2, 0.25, 16, 1, 0, (node.load / 100) * Math.PI * 2]}
            />
            <meshBasicMaterial
              color={
                node.load > 90
                  ? BUSINESS_COLORS.threat.critical
                  : node.load > 70
                    ? BUSINESS_COLORS.status.warning
                    : BUSINESS_COLORS.status.success
              }
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {/* 选中效果 */}
        {isSelected && (
          <Sphere args={[1.5]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={BUSINESS_COLORS.primary.main}
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </Sphere>
        )}

        {/* 威胁警告效果 */}
        {hasActiveThreat && (
          <Sphere args={[2]} position={[0, 0, 0]}>
            <meshBasicMaterial
              color={BUSINESS_COLORS.threat.critical}
              transparent
              opacity={0.05}
              side={THREE.DoubleSide}
            />
          </Sphere>
        )}

        {/* 环绕粒子效果 */}
        {node.type === "core" && (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 1.5;
              return (
                <EnhancedParticle
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(i * 0.5) * 0.3,
                    Math.sin(angle) * radius,
                  ]}
                  color={BUSINESS_COLORS.primary.light}
                  size={0.03}
                  behavior="orbit"
                  speed={0.5}
                  intensity={0.8}
                />
              );
            })}
          </>
        )}

        {/* 数据流粒子 */}
        {node.dataFlow > 0.3 && (
          <>
            {Array.from({ length: Math.ceil(node.dataFlow * 3) }).map(
              (_, i) => (
                <EnhancedParticle
                  key={`data-${i}`}
                  position={[
                    (Math.random() - 0.5) * 2,
                    0.5 + Math.random() * 0.5,
                    (Math.random() - 0.5) * 2,
                  ]}
                  color={BUSINESS_COLORS.scene3d.particles.data}
                  size={0.02}
                  behavior="data"
                  speed={1 + Math.random()}
                  intensity={0.6}
                />
              ),
            )}
          </>
        )}
      </group>
    );
  },
);

// 动态安全防护罩系统
const DynamicSecurityShield = React.memo(
  ({
    config,
    threatEvents = [],
  }: {
    config: SecurityShieldConfig;
    threatEvents?: ThreatEvent[];
  }) => {
    const shieldRef = useRef<THREE.Group>(null);
    const innerShieldRef = useRef<THREE.Mesh>(null);
    const outerShieldRef = useRef<THREE.Mesh>(null);

    const activeThreatCount = threatEvents.filter((t) => t.active).length;
    const shieldIntensity = Math.max(
      0.1,
      config.strength - activeThreatCount * 0.1,
    );

    useFrame((state) => {
      if (!shieldRef.current) return;

      const time = state.clock.elapsedTime;

      // 主体旋转
      shieldRef.current.rotation.y = time * 0.1;

      // 根据威胁调整效果
      if (
        innerShieldRef.current &&
        innerShieldRef.current.material instanceof THREE.MeshBasicMaterial
      ) {
        innerShieldRef.current.material.opacity =
          shieldIntensity * (0.1 + Math.sin(time * 2) * 0.05);
      }

      if (
        outerShieldRef.current &&
        outerShieldRef.current.material instanceof THREE.MeshBasicMaterial
      ) {
        outerShieldRef.current.material.opacity =
          shieldIntensity * (0.05 + Math.sin(time * 3) * 0.03);
      }

      // 威胁响应
      if (activeThreatCount > 0) {
        const pulseIntensity = 1 + Math.sin(time * 6) * 0.3;
        shieldRef.current.scale.setScalar(pulseIntensity);
      } else {
        shieldRef.current.scale.setScalar(1);
      }
    });

    if (!config.enabled) return null;

    return (
      <group ref={shieldRef}>
        {/* 内层防护罩 */}
        <mesh ref={innerShieldRef} position={[0, 1, 0]}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial
            color={
              activeThreatCount > 0
                ? BUSINESS_COLORS.threat.high
                : BUSINESS_COLORS.primary.main
            }
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>

        {/* 外层防护罩 */}
        <mesh ref={outerShieldRef} position={[0, 1, 0]}>
          <sphereGeometry args={[5, 24, 24]} />
          <meshBasicMaterial
            color={
              activeThreatCount > 0
                ? BUSINESS_COLORS.threat.critical
                : BUSINESS_COLORS.primary.light
            }
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>

        {/* 防护节点 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 12);
          const theta = Math.sqrt(12 * Math.PI) * phi;
          const radius = 4.2;

          return (
            <EnhancedParticle
              key={i}
              position={[
                radius * Math.cos(theta) * Math.sin(phi),
                radius * Math.cos(phi) + 1,
                radius * Math.sin(theta) * Math.sin(phi),
              ]}
              color={
                activeThreatCount > 0
                  ? BUSINESS_COLORS.threat.medium
                  : BUSINESS_COLORS.primary.main
              }
              size={0.04}
              behavior="pulse"
              speed={activeThreatCount > 0 ? 2 : 0.8}
              intensity={shieldIntensity}
            />
          );
        })}

        {/* 防护波纹 */}
        {config.activeDefenses.map((defense, i) => (
          <mesh
            key={defense}
            position={[0, 1, 0]}
            rotation={[Math.PI / 2, 0, (i * Math.PI) / 4]}
          >
            <ringGeometry args={[3 + i * 0.5, 3.2 + i * 0.5, 32]} />
            <meshBasicMaterial
              color={BUSINESS_COLORS.status.success}
              transparent
              opacity={0.3 * shieldIntensity}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    );
  },
);

// 威胁可视化系统
const ThreatVisualization = React.memo(
  ({
    threats,
    showTrails = true,
  }: {
    threats: ThreatEvent[];
    showTrails?: boolean;
  }) => {
    const groupRef = useRef<THREE.Group>(null);

    return (
      <group ref={groupRef}>
        {threats.map((threat) => (
          <group key={threat.id}>
            {/* 威胁源指示器 */}
            <Cone args={[0.15, 0.3]} position={threat.source}>
              <meshBasicMaterial
                color={BUSINESS_COLORS.threat[threat.severity]}
                emissive={BUSINESS_COLORS.threat[threat.severity]}
                emissiveIntensity={threat.active ? 0.6 : 0.2}
              />
            </Cone>

            {/* 威胁目标指示器 */}
            <Sphere args={[0.1]} position={threat.target}>
              <meshBasicMaterial
                color={BUSINESS_COLORS.threat[threat.severity]}
                emissive={BUSINESS_COLORS.threat[threat.severity]}
                emissiveIntensity={threat.active ? 0.8 : 0.3}
              />
            </Sphere>

            {/* 威胁攻击路径 */}
            {threat.active && (
              <AdvancedDataFlow
                start={threat.source}
                end={threat.target}
                color={BUSINESS_COLORS.threat[threat.severity]}
                speed={2}
                intensity={1}
                flowType="threat"
                particleCount={threat.severity === "critical" ? 5 : 3}
              />
            )}

            {/* 威胁影响范围 */}
            {threat.active && threat.severity === "critical" && (
              <Sphere args={[1.5]} position={threat.target}>
                <meshBasicMaterial
                  color={BUSINESS_COLORS.threat.critical}
                  transparent
                  opacity={0.1}
                  side={THREE.DoubleSide}
                />
              </Sphere>
            )}
          </group>
        ))}
      </group>
    );
  },
);

// 主网络安全模型组件
export const BusinessSecurityModel = React.memo(
  ({
    nodes = [],
    threatEvents = [],
    shieldConfig = {
      enabled: true,
      strength: 1,
      coverage: 1,
      activeDefenses: [],
    },
    showDataFlows = true,
    showThreatVisualization = true,
    interactionMode = "view",
    onNodeSelect,
  }: {
    nodes?: NetworkNode[];
    threatEvents?: ThreatEvent[];
    shieldConfig?: SecurityShieldConfig;
    showDataFlows?: boolean;
    showThreatVisualization?: boolean;
    interactionMode?: "view" | "edit" | "monitor";
    onNodeSelect?: (nodeId: string) => void;
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera, scene } = useThree();
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

    // 默认节点配置
    const defaultNodes: NetworkNode[] = useMemo(
      () => [
        {
          id: "core-01",
          position: [0, 0, 0],
          type: "core",
          status: "online",
          load: 45,
          connections: ["fw-01", "srv-01", "srv-02", "db-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.8,
        },
        {
          id: "fw-01",
          position: [0, 2, 3],
          type: "firewall",
          status: "online",
          load: 32,
          connections: ["core-01", "ep-01", "ep-02", "router-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.6,
        },
        {
          id: "srv-01",
          position: [3, 1, 1],
          type: "server",
          status: "online",
          load: 78,
          connections: ["core-01", "db-01"],
          threatLevel: "low",
          lastActivity: new Date(),
          dataFlow: 0.9,
        },
        {
          id: "srv-02",
          position: [-3, 1, 1],
          type: "server",
          status: "warning",
          load: 89,
          connections: ["core-01", "db-01"],
          threatLevel: "medium",
          lastActivity: new Date(),
          dataFlow: 0.7,
        },
        {
          id: "db-01",
          position: [0, -1, -3],
          type: "database",
          status: "online",
          load: 34,
          connections: ["srv-01", "srv-02", "core-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.5,
        },
        {
          id: "router-01",
          position: [2, 0, 4],
          type: "router",
          status: "online",
          load: 56,
          connections: ["fw-01", "ep-01", "ep-02"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.4,
        },
        {
          id: "ep-01",
          position: [4, 0, 2],
          type: "endpoint",
          status: "online",
          load: 23,
          connections: ["router-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.3,
        },
        {
          id: "ep-02",
          position: [-4, 0, 2],
          type: "endpoint",
          status: "online",
          load: 18,
          connections: ["router-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.2,
        },
        {
          id: "cloud-01",
          position: [0, 3, -2],
          type: "cloud",
          status: "online",
          load: 12,
          connections: ["core-01"],
          threatLevel: "safe",
          lastActivity: new Date(),
          dataFlow: 0.4,
        },
      ],
      [],
    );

    const activeNodes = nodes.length > 0 ? nodes : defaultNodes;

    // 生成连接线
    const connections = useMemo(() => {
      const result: Array<{
        from: [number, number, number];
        to: [number, number, number];
        encrypted: boolean;
      }> = [];

      activeNodes.forEach((node) => {
        node.connections.forEach((connectionId) => {
          const targetNode = activeNodes.find((n) => n.id === connectionId);
          if (targetNode) {
            result.push({
              from: node.position,
              to: targetNode.position,
              encrypted:
                node.type === "firewall" || targetNode.type === "firewall",
            });
          }
        });
      });

      return result;
    }, [activeNodes]);

    // 处理节点选择
    const handleNodeSelect = useCallback(
      (nodeId: string) => {
        if (interactionMode === "view") return;

        setSelectedNodes((prev) => {
          const newSelection = prev.includes(nodeId)
            ? prev.filter((id) => id !== nodeId)
            : [...prev, nodeId];

          onNodeSelect?.(nodeId);
          return newSelection;
        });
      },
      [interactionMode, onNodeSelect],
    );

    // 场景动画
    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      }
    });

    return (
      <group ref={groupRef} position={[0, -1, 0]}>
        {/* 环境光照 */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
        />
        <pointLight
          position={[0, 8, 0]}
          intensity={0.6}
          color={BUSINESS_COLORS.scene3d.lighting.point}
          distance={25}
        />

        {/* 动态彩色光源 */}
        <pointLight
          position={[5, 3, 5]}
          intensity={0.3}
          color={BUSINESS_COLORS.scene3d.lighting.accent}
          distance={15}
        />

        {/* ��络连接线 */}
        {connections.map((connection, index) => (
          <AdvancedDataFlow
            key={index}
            start={connection.from}
            end={connection.to}
            color={
              connection.encrypted
                ? BUSINESS_COLORS.status.success
                : BUSINESS_COLORS.primary.light
            }
            speed={0.8}
            intensity={0.6}
            flowType={connection.encrypted ? "encrypted" : "standard"}
            particleCount={2}
          />
        ))}

        {/* 数据流可视化 */}
        {showDataFlows &&
          activeNodes.map((node, index) => {
            const targetNode = activeNodes[(index + 1) % activeNodes.length];
            return (
              <AdvancedDataFlow
                key={`flow-${node.id}`}
                start={node.position}
                end={targetNode.position}
                color={BUSINESS_COLORS.scene3d.particles.data}
                speed={1.5}
                intensity={node.dataFlow}
                flowType="standard"
                particleCount={Math.ceil(node.dataFlow * 3)}
              />
            );
          })}

        {/* 网络节点 */}
        {activeNodes.map((node) => (
          <AdvancedNetworkNode
            key={node.id}
            node={node}
            isSelected={selectedNodes.includes(node.id)}
            onSelect={handleNodeSelect}
            threatEvents={threatEvents}
          />
        ))}

        {/* 动态安全防护罩 */}
        <DynamicSecurityShield
          config={shieldConfig}
          threatEvents={threatEvents}
        />

        {/* 威胁可视化 */}
        {showThreatVisualization && (
          <ThreatVisualization threats={threatEvents} showTrails={true} />
        )}

        {/* 环境粒子效果 */}
        {Array.from({ length: 25 }).map((_, i) => (
          <EnhancedParticle
            key={`ambient-${i}`}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 20,
            ]}
            color={BUSINESS_COLORS.scene3d.particles.default}
            size={0.01 + Math.random() * 0.01}
            behavior="float"
            speed={0.3 + Math.random() * 0.2}
            intensity={0.4 + Math.random() * 0.3}
          />
        ))}

        {/* 场景雾效 */}
        <fog
          attach="fog"
          args={[BUSINESS_COLORS.scene3d.background.primary, 10, 40]}
        />
      </group>
    );
  },
);

// 导出其他组件
export const BusinessShield = React.memo(
  ({ status = "protected" }: { status?: string }) => (
    <DynamicSecurityShield
      config={{
        enabled: true,
        strength: 1,
        coverage: 1,
        activeDefenses: ["firewall", "ids", "antivirus"],
      }}
      threatEvents={[]}
    />
  ),
);

export const BusinessNetworkTopology = React.memo(
  ({ scale = 1 }: { scale?: number }) => (
    <group scale={scale}>
      <BusinessSecurityModel />
    </group>
  ),
);

export default BusinessSecurityModel;
