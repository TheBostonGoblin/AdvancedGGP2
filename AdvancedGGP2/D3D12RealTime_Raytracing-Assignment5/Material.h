#pragma once
#include <DirectXMath.h>
#include <wrl/client.h> // Used for ComPtr - a smart pointer for COM objects
#include "DXCore.h"
using namespace DirectX;
using namespace std;
class Material
{
public:
	Material(Microsoft::WRL::ComPtr<ID3D12PipelineState> pipelineState, XMFLOAT3 colorTint, XMFLOAT2 uvScale, XMFLOAT2 uvOffset);
	~Material();
	void AddTexture(D3D12_CPU_DESCRIPTOR_HANDLE srv, int slot);
	void FinalizeMaterial();
	Microsoft::WRL::ComPtr<ID3D12PipelineState> GetPipelineState();
	XMFLOAT3 GetColorTint();
	XMFLOAT2 GetUVScale();
	XMFLOAT2 GetUVOffset();
	D3D12_GPU_DESCRIPTOR_HANDLE GetFinalGPUHandle();

	void SetPipelineState(Microsoft::WRL::ComPtr<ID3D12PipelineState> pipelineState);
	void SetColorTint(XMFLOAT3 colorTint);
	void SetUVScale(XMFLOAT2 uvScale);
	void SetUVOffset(XMFLOAT2 uvoffSet);
	void SetFinalGPUHandle(D3D12_GPU_DESCRIPTOR_HANDLE finalGPUHandle);

private:
	XMFLOAT3 colorTint;
	XMFLOAT2 uvScale;
	XMFLOAT2 uvOffset;
	bool finalized;
	Microsoft::WRL::ComPtr<ID3D12PipelineState> pipelineState;
	D3D12_CPU_DESCRIPTOR_HANDLE textureSRVsBySlot [128];
	D3D12_GPU_DESCRIPTOR_HANDLE finalGPUHandleForSRVs;
	

};

