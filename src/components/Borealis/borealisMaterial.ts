import { shaderMaterial } from "@react-three/drei";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { Vector2 } from "three";

type BorealisMaterialUniformsType = {
  elapsedTime: number;
  viewportResolution: Vector2;
  mousePosition: Vector2;
}

const BorealisMaterial = shaderMaterial({
  elapsedTime: 0,
  viewportResolution: new Vector2(window.innerWidth, window.innerHeight),
  mousePosition: new Vector2(0, 0)
}, `
  // VERTEX SHADER
  varying vec2 vertexUV;

  void main() {
    vertexUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`, `
  // FRAGMENT SHADER
  #define time elapsedTime

  uniform vec2 viewportResolution;
  uniform vec2 mousePosition;
  uniform float elapsedTime;

  varying vec2 vertexUV;

  // Creates a 2D rotation matrix for a given angle in radians

  mat2 createRotationMatrix2D(in float angleRadians) {
    float cosAngle = cos(angleRadians);
    float sinAngle = sin(angleRadians);
    return mat2(cosAngle, sinAngle, -sinAngle, cosAngle);
  }

  mat2 noiseRotationMatrix = mat2(0.95534, 0.29552, -0.29552, 0.95534);

  // Creates a triangular wave pattern from 0 to 1

  float createTriangleWave(in float x) {
    return clamp(abs(fract(x)-.5), 0.01, 0.49);
  }

  //  Generates 2D triangular noise pattern 

  vec2 createTriangleNoise2D(in vec2 position) {
    return vec2(
      createTriangleWave(position.x) + createTriangleWave(position.y),
      createTriangleWave(position.y + createTriangleWave(position.x))
    );
  }

  // Generates smooth, flowing triangular noise using layered fractional Brownian motion

  float generateAuroraNoiseField(in vec2 position, float animationSpeed) {
    float zoomLevel = 1.1;
    float secondaryZoomLevel = 2.5;
    float accumulatedNoise = 0.0;
    
    vec2 basePosition = position;
    position *= createRotationMatrix2D(position.x * 0.06);
    
    for (float layerIndex = 0.0; layerIndex < 5.0; layerIndex++ ) {
      vec2 noiseDerivative = createTriangleNoise2D(basePosition * 1.85) * 0.75;
      noiseDerivative *= createRotationMatrix2D(time * animationSpeed);
      
      position -= noiseDerivative / secondaryZoomLevel;
      basePosition *= 1.3;
      secondaryZoomLevel *= 0.45;
      zoomLevel *= 0.42;
      
      position *= 1.21 + (accumulatedNoise - 1.0) * 0.02;
      accumulatedNoise += createTriangleWave(position.x + createTriangleWave(position.y)) * zoomLevel;
      position *= -noiseRotationMatrix;
    }
    
    return clamp(1.0 / pow(accumulatedNoise * 29.0, 1.3), 0.0, 0.55);
  }

  // Generates a pseudo-random hash value from a 2D input

  float hash2DToScalar(in vec2 inputVector) {
    return fract(sin(dot(inputVector, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  // Renders the aurora borealis effect by marching through layers

  vec4 renderAuroraEffect(vec3 rayOrigin, vec3 rayDirection) {
    vec4 accumulatedColor = vec4(0.0);
    vec4 averagedColor = vec4(0.0);
    
    const int raymarchSteps = 14;
    for(float stepIndex = 0.0; stepIndex < float(raymarchSteps); stepIndex++) {
    
      // Add slight noise variation based on screen position
      float dithering = 0.006 * hash2DToScalar(gl_FragCoord.xy) * smoothstep(0.0, 15.0, stepIndex);
      
      // Calculate intersection point at current layer
      float intersectionDistance = ((.8 + pow(stepIndex, 1.2) * 0.005) - rayOrigin.y) / (rayDirection.y * 2.0 + 0.4);
      intersectionDistance -= dithering;
      
      vec3 currentLayerPosition = rayOrigin + intersectionDistance * rayDirection;
      vec2 noiseCoordinate = currentLayerPosition.zx;
      
      float noiseValue = generateAuroraNoiseField(noiseCoordinate, 0.3);
      vec4 layerColor = vec4(0.0, 0.0, 0.0, noiseValue);
      
      // Color the noise based on the layer index with an animated hue
      layerColor.rgb = (sin(1.0 - vec3(1.5, 0.3, 1.3) + stepIndex * 0.24) * 0.5 + 0.4) * noiseValue;
      
      // Blend layers together
      averagedColor = mix(averagedColor, layerColor, 0.5);
      
      // Accumulate colors with exponential falloff (creates depth effect)
      accumulatedColor += averagedColor * exp2(-stepIndex * 0.065 - 2.5) * smoothstep(0.0, 5.0, stepIndex);
    }
    
    // Apply horizon fade effect
    accumulatedColor *= clamp(rayDirection.y * 15.0 + 0.4, 0.0, 1.0);
    
    return accumulatedColor * 2.8;
  }

  // Generates a 3D pseudo-random hash (unused but part of original)

  vec3 hash3DToScalar(vec3 inputVector) {
    uvec3 prime = uvec3(inputVector);
    prime = prime * uvec3(374761393U, 1103515245U, 668265263U) + prime.zxy + prime.yzx;
    prime = prime.yzx * (prime.zxy ^ (prime >> 3U));
    return vec3(prime ^ (prime >> 16U)) * (1.0 / vec3(0xffffffffU));
  }

  // Renders the night sky background gradient

  vec3 renderNightSkyBackground(in vec3 rayDirection) {
    // Calculate sky color based on direction to light source
    float sunDirection = dot(normalize(vec3(-0.5, -0.6, 0.9)), rayDirection) * 0.5 + 0.5;
    sunDirection = pow(sunDirection, 5.0);
    
    // Blend from dark blue to purple based on sun direction
    vec3 skyColor = mix(vec3(0.0, 0.08, 0.14), vec3(0.0, 0.14, 0.2), sunDirection);
    
    return skyColor * 0.63;
  }

  void main() {
    vec2 fragmentCoordinate = vertexUV * viewportResolution;
    vec2 normalizedScreenPosition = fragmentCoordinate.xy / viewportResolution.xy;
    vec2 rayScreenPosition = normalizedScreenPosition + 0.1;
    
    // Account for aspect ratio
    rayScreenPosition.x *= viewportResolution.x / viewportResolution.y;
    
    // Set up ray origin and direction for raytracing
    vec3 rayOrigin = vec3(0.0, 0.0, -3.5);
    vec3 rayDirection = normalize(vec3(rayScreenPosition, 0.85));
    
    // Get mouse input (converted to normalized coordinates)
    vec2 normalizedMousePosition = mousePosition.xy / viewportResolution.xy - 0.5;
    normalizedMousePosition = (normalizedMousePosition == vec2(-0.5)) ? vec2(-0.1, 0.1) : normalizedMousePosition;
    normalizedMousePosition.x *= viewportResolution.x / viewportResolution.y;
    
    // Apply mouse-based camera rotation
    rayDirection.yz *= createRotationMatrix2D(normalizedMousePosition.y * -0.25);
    rayDirection.xz *= createRotationMatrix2D(normalizedMousePosition.x * 0.5);
    
    // Initialize final color
    vec3 finalColor = vec3(0.0);
    vec3 baseRayDirection = rayDirection;
    
    // Create a fade effect for the horizon
    float horizonFade = smoothstep(0.0, 0.01, abs(baseRayDirection.y)) * 0.05 + 0.9;
    
    // Render background sky
    finalColor = renderNightSkyBackground(rayDirection) * horizonFade;
    
    // Render aurora only if ray is pointing upward
    if (rayDirection.y > 0.0){
      vec4 auroraColor = smoothstep(0.0, 1.5, renderAuroraEffect(rayOrigin, rayDirection)) * horizonFade;
      finalColor = finalColor * (1.0 - auroraColor.a) + auroraColor.rgb;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`)

declare global { namespace JSX { interface IntrinsicElements {
  borealisMaterial: ReactThreeFiber.Object3DNode<BorealisMaterialUniformsType, typeof BorealisMaterial>
}}}

extend({ BorealisMaterial })

export type { BorealisMaterialUniformsType }