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