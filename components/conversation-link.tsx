"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Vector3, CatmullRomCurve3 } from "three"
import { Line } from "@react-three/drei"

interface ConversationLinkProps {
  start: Vector3
  end: Vector3
  color: string
  thickness?: number
}

export function ConversationLink({ start, end, color, thickness = 0.02 }: ConversationLinkProps) {
  const lineRef = useRef<any>(null)

  // Create a curved path between points with proper validation
  const points = useMemo(() => {
    try {
      // Validate input vectors
      if (
        !start ||
        !end ||
        !isFinite(start.x) ||
        !isFinite(start.y) ||
        !isFinite(start.z) ||
        !isFinite(end.x) ||
        !isFinite(end.y) ||
        !isFinite(end.z)
      ) {
        console.warn("Invalid start or end points for ConversationLink")
        return [new Vector3(0, 0, 0), new Vector3(1, 0, 0)]
      }

      // Create control point with validation
      const midX = (start.x + end.x) / 2
      const midY = (start.y + end.y) / 2
      const midZ = (start.z + end.z) / 2

      // Add some randomness but keep it controlled
      const offsetX = (Math.random() - 0.5) * 1
      const offsetY = (Math.random() - 0.5) * 0.3
      const offsetZ = (Math.random() - 0.5) * 1

      const controlPoint = new Vector3(midX + offsetX, midY + offsetY, midZ + offsetZ)

      // Validate control point
      if (!isFinite(controlPoint.x) || !isFinite(controlPoint.y) || !isFinite(controlPoint.z)) {
        console.warn("Invalid control point, using straight line")
        return [start.clone(), end.clone()]
      }

      // Create curve and validate points
      const curve = new CatmullRomCurve3([start.clone(), controlPoint, end.clone()])
      const curvePoints = curve.getPoints(20)

      // Validate all curve points
      const validPoints = curvePoints.filter((point) => isFinite(point.x) && isFinite(point.y) && isFinite(point.z))

      if (validPoints.length < 2) {
        console.warn("Invalid curve points, using straight line")
        return [start.clone(), end.clone()]
      }

      return validPoints
    } catch (error) {
      console.error("Error creating curve:", error)
      // Fallback to straight line with validated points
      return [start.clone(), end.clone()]
    }
  }, [start, end])

  // Animate data flow along the link with error handling
  useFrame(({ clock }) => {
    try {
      if (lineRef.current && lineRef.current.material && lineRef.current.material.dashOffset !== undefined) {
        lineRef.current.material.dashOffset = -clock.getElapsedTime()
      }
    } catch (error) {
      // Silently handle animation errors
    }
  })

  // Don't render if we don't have valid points
  if (!points || points.length < 2) {
    return null
  }

  return <Line ref={lineRef} points={points} color={color} lineWidth={Math.max(0.01, thickness)} dashed={false} />
}
