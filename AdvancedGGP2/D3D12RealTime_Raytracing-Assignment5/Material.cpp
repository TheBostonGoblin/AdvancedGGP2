#include "Material.h"
#include <wrl/client.h> // Used for ComPtr - a smart pointer for COM objects
#include "DXCore.h"
#include <DirectXMath.h>
#include "DX12Helper.h"
using namespace DirectX;

Material::Material(Microsoft::WRL::ComPtr<ID3D12PipelineState> pipelineState, XMFLOAT3 colorTint, XMFLOAT2 uvScale, XMFLOAT2 uvOffset)
{
	this->pipelineState = pipelineState;
	this->colorTint = colorTint;
	this->uvScale = uvScale;
	this->uvOffset = uvOffset;
	this->finalized = false;

	for (int x = 0; x < 128; x++) 
	{
		textureSRVsBySlot[x] = {};
	}
}

Material::~Material()
{
}

void Material::AddTexture(D3D12_CPU_DESCRIPTOR_HANDLE srv, int slot)
{
	//ensures slot is not out of bounds
	if (slot < 0) {
	}
	else if (slot > 128) 
	{

	}
	else 
	{
		textureSRVsBySlot[slot] = srv;
	}
}

void Material::FinalizeMaterial()
{
	if (!finalized) 
	{
		DX12Helper& dx12HelperInstance = DX12Helper::GetInstance();
		int numberOfTextureSlots = (sizeof(textureSRVsBySlot) / sizeof(textureSRVsBySlot[0]));
		for (int x = 0;x < numberOfTextureSlots;x++)
		{	
			//if the next space is empty break
			if (textureSRVsBySlot[x].ptr == 0) {
				break;
			}
			if (x == 0) 
			{
				
				finalGPUHandleForSRVs = dx12HelperInstance.CopySRVsToDescriptorHeapAndGetGPUDescriptorHandle(textureSRVsBySlot[x], 1);
				continue;
			}
			dx12HelperInstance.CopySRVsToDescriptorHeapAndGetGPUDescriptorHandle(textureSRVsBySlot[x], 1);
		}

		finalized = true;
		
	}
}

Microsoft::WRL::ComPtr<ID3D12PipelineState> Material::GetPipelineState()
{
	return this->pipelineState;
}

XMFLOAT3 Material::GetColorTint()
{
	return this->colorTint;
}

XMFLOAT2 Material::GetUVScale()
{
	return this->uvScale;
}

XMFLOAT2 Material::GetUVOffset()
{
	return this->uvOffset;
}

D3D12_GPU_DESCRIPTOR_HANDLE Material::GetFinalGPUHandle()
{
	return this->finalGPUHandleForSRVs;
}

void Material::SetPipelineState(Microsoft::WRL::ComPtr<ID3D12PipelineState> pipelineState)
{
	this->pipelineState = pipelineState;
}

void Material::SetColorTint(XMFLOAT3 colorTint)
{
	this->colorTint = colorTint;
}

void Material::SetUVScale(XMFLOAT2 uvScale)
{
	this->uvScale = uvScale;
}

void Material::SetUVOffset(XMFLOAT2 uvoffSet)
{
	this->uvScale = uvScale;
}

void Material::SetFinalGPUHandle(D3D12_GPU_DESCRIPTOR_HANDLE finalGPUHandle)
{
	this->finalGPUHandleForSRVs = finalGPUHandle;
}
