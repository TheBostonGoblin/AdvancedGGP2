#pragma once
#include <DirectXMath.h>
#include "Light.h"
using namespace DirectX;
struct VertexShaderExternalData {
	XMFLOAT4X4 world;
	XMFLOAT4X4 worldInverseTranspose;
	XMFLOAT4X4 view;
	XMFLOAT4X4 projection;
	
};

struct PixelShaderExternalData
{
	XMFLOAT2 uvScale;
	XMFLOAT2 uvOffset;
	XMFLOAT3 cameraPosition;
	int lightCount;
	Light lights[128];
};

// Overall scene data for raytracing
struct RaytracingSceneData
{
	DirectX::XMFLOAT4X4 inverseViewProjection;
	DirectX::XMFLOAT3 cameraPosition;
};
// Ensure this matches Raytracing shader define!
#define MAX_INSTANCES_PER_BLAS 100
struct RaytracingEntityData
{
	DirectX::XMFLOAT4 color[MAX_INSTANCES_PER_BLAS];
};