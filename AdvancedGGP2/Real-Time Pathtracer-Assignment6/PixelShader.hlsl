
#include "Lighting.hlsli"

// Struct representing the data we expect to receive from earlier pipeline stages
// - Should match the output of our corresponding vertex shader
// - The name of the struct itself is unimportant
// - The variable names don't have to match other shaders (just the semantics)
// - Each variable must have a semantic, which defines its usage

// Alignment matters!!!
cbuffer ExternalData : register(b0)
{
	float2 uvScale;
	float2 uvOffset;
	float3 cameraPosition;
	int lightCount;
	Light lights[128];
}

struct VertexToPixel
{
	// Data type
	//  |
	//  |   Name          Semantic
	//  |    |                |
	//  v    v                v
	float4 screenPosition	: SV_POSITION;
	float3 normal			: NORMAL;
	float3 tangent			: TANGENT;
	float2 uv				: TEXCOORD;
	float3 worldPosition	: POSITION;
};

// --------------------------------------------------------
// The entry point (main method) for our pixel shader
// 
// - Input is the data coming down the pipeline (defined by the struct)
// - Output is a single color (float4)
// - Has a special semantic (SV_TARGET), which means 
//    "put the output of this into the current render target"
// - Named "main" because that's the default the shader compiler looks for
// --------------------------------------------------------

Texture2D normalMap :register(t0);
Texture2D roughMap  :register(t1);
Texture2D albedoMap :register(t2);
Texture2D metalMap  :register(t3);
SamplerState samplerState :register(s0);

float4 main(VertexToPixel input) : SV_TARGET
{
	// always re-normalize interpolated direction vectors
	input.normal = normalize(input.normal);
	input.tangent = normalize(input.tangent);

	// apply the uv adjustments
	input.uv = input.uv * uvScale + uvOffset;

	// normal mapping
	input.normal = NormalMapping(normalMap, samplerState, input.uv, input.normal, input.tangent);

	// treating roughness as a pseduo-spec map here
	float roughness = roughMap.Sample(samplerState, input.uv).r;
	float metalness = metalMap.Sample(samplerState, input.uv).r;
	float specPower = max(256.0f * (1.0f - roughness), 0.01f); // ensure we never hit 0
	

	// gamma correct the texture back to linear space and apply the color tint
	float4 surfaceColor = albedoMap.Sample(samplerState, input.uv);
	surfaceColor.rgb = pow(surfaceColor.rgb, 2.2);
	float3 specColor = lerp(F0_NON_METAL.rrr, surfaceColor.rgb, metalness);

	//total color for this pixel
	float3 totalColor = float3(0,0,0);

	//Loop through all lights this frame
	for (int i = 0; i < lightCount; i++)
	{

		// Which kind of light?
		switch (lights[i].Type)
		{
		case LIGHT_TYPE_DIRECTIONAL:
			totalColor += DirLightPBR(lights[i], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
			break;

		case LIGHT_TYPE_POINT:
			totalColor += PointLightPBR(lights[i], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
			break;

		case LIGHT_TYPE_SPOT:
			totalColor += SpotLightPBR(lights[i], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
			break;
		}
	}

	/*totalColor += DirLightPBR(lights[0], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
	totalColor += DirLightPBR(lights[1], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
	totalColor += DirLightPBR(lights[2], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);
	totalColor += DirLightPBR(lights[3], input.normal, input.worldPosition, cameraPosition, roughness, metalness, surfaceColor.rgb, specColor);*/

	//Gamma correction
	return float4(pow(totalColor, (1.0f / 2.2f)), 1.0f);

	//float4 ps = albedoMap.Sample(samplerState,input.uv);
	//return ps;
	//return float4(specColor,1.0f);
}