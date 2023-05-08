#include "Game.h"
#include "Vertex.h"
#include "Input.h"
#include "Helpers.h"
#include "DX12Helper.h"
#include <memory>
#include "Mesh.h"
#include "GameEntity.h"
#include "BufferStructs.h"
#include "Material.h"
// Needed for a helper function to load pre-compiled shader files
#pragma comment(lib, "d3dcompiler.lib")
#include <d3dcompiler.h>
#include "RaytracingHelper.h"
#include <iostream>

#define _USE_MATH_DEFINES
#include <math.h>
// For the DirectX Math library
using namespace DirectX;

// --------------------------------------------------------
// Constructor
//
// DXCore (base class) constructor will set up underlying fields.
// Direct3D itself, and our window, are not ready at this point!
//
// hInstance - the application's OS-level handle (unique ID)
// --------------------------------------------------------
Game::Game(HINSTANCE hInstance)
	: DXCore(
		hInstance,			// The application's handle
		L"DirectX Game",	// Text for the window's title bar (as a wide-character string)
		1280,				// Width of the window's client area
		720,				// Height of the window's client area
		false,				// Sync the framerate to the monitor refresh? (lock framerate)
		true)				// Show extra stats (fps) in title bar?
{
#if defined(DEBUG) || defined(_DEBUG)
	// Do we want a console window?  Probably only in debug mode
	CreateConsoleWindow(500, 120, 32, 120);
	printf("Console window created successfully.  Feel free to printf() here.\n");
#endif
}

// --------------------------------------------------------
// Destructor - Clean up anything our game has created:
//  - Delete all objects manually created within this class
//  - Release() all Direct3D objects created within this class
// --------------------------------------------------------
Game::~Game()
{
	// Call delete or delete[] on any objects or arrays you've
	// created using new or new[] within this class
	// - Note: this is unnecessary if using smart pointers

	// Call Release() on any Direct3D objects made within this class
	// - Note: this is unnecessary for D3D objects stored in ComPtrs

	// We need to wait here until the GPU
	// is actually done with its work
	DX12Helper::GetInstance().WaitForGPU();
}

// --------------------------------------------------------
// Called once per program, after Direct3D and the window
// are initialized but before the game loop.
// --------------------------------------------------------
void Game::Init()
{
	lights.clear();
	Light dir1 = {};
	dir1.Type = LIGHT_TYPE_DIRECTIONAL;
	dir1.Direction = XMFLOAT3(1, -1, 1);
	dir1.Color = XMFLOAT3(0.0f, 0.0f, 1.0f);
	dir1.Intensity = 1.0f;

	Light dir2 = {};
	dir2.Type = LIGHT_TYPE_DIRECTIONAL;
	dir2.Direction = XMFLOAT3(-1, -0.25f, 0);
	dir2.Color = XMFLOAT3(0.0f, 1.0f, 0.0f);
	dir2.Intensity = 1.0f;

	Light dir3 = {};
	dir3.Type = LIGHT_TYPE_DIRECTIONAL;
	dir3.Direction = XMFLOAT3(0, -1, 1);
	dir3.Color = XMFLOAT3(1.0f, 0.0f, 0.0f);
	dir3.Intensity = 1.0f;

	lights.push_back(dir1);
	lights.push_back(dir2);
	lights.push_back(dir3);


	// Helper methods for loading shaders, creating some basic
	// geometry to draw and some simple camera matrices.
	//  - You'll be expanding and/or replacing these later
	CreateRootSigAndPipelineState();

	D3D12_CPU_DESCRIPTOR_HANDLE bronzeNormal = DX12Helper::GetInstance().LoadTexture(FixPath(L"../../Assets/Textures/bronze_normals.png").c_str(), true);//normal
	D3D12_CPU_DESCRIPTOR_HANDLE bronzeRoughness = DX12Helper::GetInstance().LoadTexture(FixPath(L"../../Assets/Textures/bronze_roughness.png").c_str(), true);//roughness
	D3D12_CPU_DESCRIPTOR_HANDLE bronzeAlbedo = DX12Helper::GetInstance().LoadTexture(FixPath(L"../../Assets/Textures/bronze_albedo.png").c_str(), true);//albedo
	D3D12_CPU_DESCRIPTOR_HANDLE bronzeMetal = DX12Helper::GetInstance().LoadTexture(FixPath(L"../../Assets/Textures/bronze_metal.png").c_str(), true);//metal

	XMFLOAT2 uvScale = XMFLOAT2(1, 1);
	XMFLOAT2 uvOffset = XMFLOAT2(0, 0);
	XMFLOAT3 colorTint = XMFLOAT3(1, 1, 1);
	material1 = std::make_shared<Material>(pipelineState, colorTint, uvScale, uvOffset);
	material1->AddTexture(bronzeNormal, 0);
	material1->AddTexture(bronzeRoughness, 1);
	material1->AddTexture(bronzeAlbedo, 2);
	material1->AddTexture(bronzeMetal, 3);
	material1->FinalizeMaterial();

	material2 = std::make_shared<Material>(pipelineState, XMFLOAT3(1, 0, 0), uvScale, uvOffset);
	material2->AddTexture(bronzeNormal, 0);
	material2->AddTexture(bronzeRoughness, 1);
	material2->AddTexture(bronzeAlbedo, 2);
	material2->AddTexture(bronzeMetal, 3);
	material2->FinalizeMaterial();

	material3 = std::make_shared<Material>(pipelineState, XMFLOAT3(0, 1, 0), uvScale, uvOffset);
	material3->AddTexture(bronzeNormal, 0);
	material3->AddTexture(bronzeRoughness, 1);
	material3->AddTexture(bronzeAlbedo, 2);
	material3->AddTexture(bronzeMetal, 3);
	material3->FinalizeMaterial();

	material4 = std::make_shared<Material>(pipelineState, XMFLOAT3(0.5, 0.5, 0), uvScale, uvOffset);
	material4->AddTexture(bronzeNormal, 0);
	material4->AddTexture(bronzeRoughness, 1);
	material4->AddTexture(bronzeAlbedo, 2);
	material4->AddTexture(bronzeMetal, 3);
	material4->FinalizeMaterial();

	material5 = std::make_shared<Material>(pipelineState, XMFLOAT3(0.2, 0.5, 0.75), uvScale, uvOffset);
	material5->AddTexture(bronzeNormal, 0);
	material5->AddTexture(bronzeRoughness, 1);
	material5->AddTexture(bronzeAlbedo, 2);
	material5->AddTexture(bronzeMetal, 3);
	material5->FinalizeMaterial();



	// Attempt to initialize DXR
	RaytracingHelper::GetInstance().Initialize(
		windowWidth,
		windowHeight,
		device,
		commandQueue,
		commandList,
		FixPath(L"Raytracing.cso"));

	CreateGeometry();
	camera = std::make_shared<Camera>(XMFLOAT3(0.0f, 0.0f, -15.0f), 10.0f, 0.001f, XM_PIDIV4, windowWidth / (float)windowHeight);

	lightCount = lights.size();

	
}

// --------------------------------------------------------
// Creates the geometry we're going to draw - a single triangle for now
// --------------------------------------------------------
void Game::CreateGeometry()
{
	std::shared_ptr<Mesh> cubeMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/cube.obj").c_str());
	std::shared_ptr<Mesh> cylinderMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/cylinder.obj").c_str());
	std::shared_ptr<Mesh> coneMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/cone.obj").c_str());
	std::shared_ptr<Mesh> helixMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/helix.obj").c_str());
	std::shared_ptr<Mesh> treeMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/lowpoly tree.obj").c_str());
	std::shared_ptr<Mesh> sphereMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/sphere.obj").c_str());
	std::shared_ptr<Mesh> torusMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/torus.obj").c_str());
	std::shared_ptr<Mesh> tvMesh = std::make_shared<Mesh>(FixPath(L"../../Assets/Models/tv.obj").c_str());

	std::shared_ptr<GameEntity> cubeObj1 = std::make_shared<GameEntity>(cubeMesh);
	cubeObj1->GetTransform()->SetPosition(0, 0, 0);
	cubeObj1->SetMaterial(material1);

	std::shared_ptr<GameEntity> cubeObj2 = std::make_shared<GameEntity>(cubeMesh);
	cubeObj2->GetTransform()->SetPosition(-2, 0, 0);
	cubeObj2->SetMaterial(material2);

	std::shared_ptr<GameEntity> helixObj1 = std::make_shared<GameEntity>(helixMesh);
	helixObj1->GetTransform()->SetPosition(2, 0, 0);
	helixObj1->SetMaterial(material3);

	std::shared_ptr<GameEntity> sphereObj1 = std::make_shared<GameEntity>(sphereMesh);
	sphereObj1->GetTransform()->SetPosition(3, 0, 0);
	sphereObj1->SetMaterial(material4);

	std::shared_ptr<GameEntity> torusObj1 = std::make_shared<GameEntity>(torusMesh);
	torusObj1->GetTransform()->SetPosition(-3, 0, 0);
	torusObj1->SetMaterial(material5);

	entities.push_back(cubeObj1);
	entities.push_back(cubeObj2);
	entities.push_back(helixObj1);
	entities.push_back(sphereObj1);
	entities.push_back(torusObj1);

	// Meshes create their own BLAS's; we just need to create the TLAS for the scene here
	RaytracingHelper::GetInstance().CreateTopLevelAccelerationStructureForScene(entities);
}

void Game::CreateRootSigAndPipelineState()
{
	// Blobs to hold raw shader byte code used in several steps below
	Microsoft::WRL::ComPtr<ID3DBlob> vertexShaderByteCode;
	Microsoft::WRL::ComPtr<ID3DBlob> pixelShaderByteCode;
	// Load shaders
	{
		// Read our compiled vertex shader code into a blob
		// - Essentially just "open the file and plop its contents here"
		D3DReadFileToBlob(
			FixPath(L"VertexShader.cso").c_str(),
			vertexShaderByteCode.GetAddressOf()
		);

		D3DReadFileToBlob(
			FixPath(L"PixelShader.cso").c_str(),
			pixelShaderByteCode.GetAddressOf()
		);
	}

	// Input layout
	const unsigned int inputElementCount = 4;
	D3D12_INPUT_ELEMENT_DESC inputElements[inputElementCount] = {};
	{
		inputElements[0].AlignedByteOffset = D3D12_APPEND_ALIGNED_ELEMENT;
		inputElements[0].Format = DXGI_FORMAT_R32G32B32_FLOAT; // R32 G32 B32 = float3
		inputElements[0].SemanticName = "POSITION"; // Name must match semantic in shader
		inputElements[0].SemanticIndex = 0; // This is the first POSITION semantic

		inputElements[1].AlignedByteOffset = D3D12_APPEND_ALIGNED_ELEMENT;
		inputElements[1].Format = DXGI_FORMAT_R32G32_FLOAT; // R32 G32 = float2
		inputElements[1].SemanticName = "TEXCOORD";
		inputElements[1].SemanticIndex = 0; // This is the first TEXCOORD semantic

		inputElements[2].AlignedByteOffset = D3D12_APPEND_ALIGNED_ELEMENT;
		inputElements[2].Format = DXGI_FORMAT_R32G32B32_FLOAT; // R32 G32 B32 = float3
		inputElements[2].SemanticName = "NORMAL";
		inputElements[2].SemanticIndex = 0; // This is the first NORMAL semantic

		inputElements[3].AlignedByteOffset = D3D12_APPEND_ALIGNED_ELEMENT;
		inputElements[3].Format = DXGI_FORMAT_R32G32B32_FLOAT; // R32 G32 B32 = float3
		inputElements[3].SemanticName = "TANGENT";
		inputElements[3].SemanticIndex = 0; // This is the first TANGENT semantic
	}

	// Root Signature
	{
		// Describe the range of CBVs needed for the vertex shader
		D3D12_DESCRIPTOR_RANGE cbvRangeVS = {};
		cbvRangeVS.RangeType = D3D12_DESCRIPTOR_RANGE_TYPE_CBV;
		cbvRangeVS.NumDescriptors = 1;
		cbvRangeVS.BaseShaderRegister = 0;
		cbvRangeVS.RegisterSpace = 0;
		cbvRangeVS.OffsetInDescriptorsFromTableStart = D3D12_DESCRIPTOR_RANGE_OFFSET_APPEND;

		// Describe the range of CBVs needed for the pixel shader
		D3D12_DESCRIPTOR_RANGE cbvRangePS = {};
		cbvRangePS.RangeType = D3D12_DESCRIPTOR_RANGE_TYPE_CBV;
		cbvRangePS.NumDescriptors = 1;
		cbvRangePS.BaseShaderRegister = 0;
		cbvRangePS.RegisterSpace = 0;
		cbvRangePS.OffsetInDescriptorsFromTableStart = D3D12_DESCRIPTOR_RANGE_OFFSET_APPEND;

		// Create a range of SRV's for textures
		D3D12_DESCRIPTOR_RANGE srvRange = {};
		srvRange.RangeType = D3D12_DESCRIPTOR_RANGE_TYPE_SRV;
		srvRange.NumDescriptors = 4; // Set to max number of textures at once (match pixel shader!)
		srvRange.BaseShaderRegister = 0; // Starts at s0 (match pixel shader!)
		srvRange.RegisterSpace = 0;
		srvRange.OffsetInDescriptorsFromTableStart = D3D12_DESCRIPTOR_RANGE_OFFSET_APPEND;

		// Create the root parameters
		D3D12_ROOT_PARAMETER rootParams[3] = {};

		// CBV table param for vertex shader
		rootParams[0].ParameterType = D3D12_ROOT_PARAMETER_TYPE_DESCRIPTOR_TABLE;
		rootParams[0].ShaderVisibility = D3D12_SHADER_VISIBILITY_VERTEX;
		rootParams[0].DescriptorTable.NumDescriptorRanges = 1;
		rootParams[0].DescriptorTable.pDescriptorRanges = &cbvRangeVS;

		// CBV table param for pixel shader
		rootParams[1].ParameterType = D3D12_ROOT_PARAMETER_TYPE_DESCRIPTOR_TABLE;
		rootParams[1].ShaderVisibility = D3D12_SHADER_VISIBILITY_PIXEL;
		rootParams[1].DescriptorTable.NumDescriptorRanges = 1;
		rootParams[1].DescriptorTable.pDescriptorRanges = &cbvRangePS;

		// SRV table param
		rootParams[2].ParameterType = D3D12_ROOT_PARAMETER_TYPE_DESCRIPTOR_TABLE;
		rootParams[2].ShaderVisibility = D3D12_SHADER_VISIBILITY_PIXEL;
		rootParams[2].DescriptorTable.NumDescriptorRanges = 1;
		rootParams[2].DescriptorTable.pDescriptorRanges = &srvRange;

		// Create a single static sampler (available to all pixel shaders at the same slot)
		D3D12_STATIC_SAMPLER_DESC anisoWrap = {};
		anisoWrap.AddressU = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		anisoWrap.AddressV = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		anisoWrap.AddressW = D3D12_TEXTURE_ADDRESS_MODE_WRAP;
		anisoWrap.Filter = D3D12_FILTER_ANISOTROPIC;
		anisoWrap.MaxAnisotropy = 16;
		anisoWrap.MaxLOD = D3D12_FLOAT32_MAX;
		anisoWrap.ShaderRegister = 0; // register(s0)
		anisoWrap.ShaderVisibility = D3D12_SHADER_VISIBILITY_PIXEL;
		D3D12_STATIC_SAMPLER_DESC samplers[] = { anisoWrap };

		// Describe and serialize the root signature
		D3D12_ROOT_SIGNATURE_DESC rootSig = {};
		rootSig.Flags = D3D12_ROOT_SIGNATURE_FLAG_ALLOW_INPUT_ASSEMBLER_INPUT_LAYOUT;
		rootSig.NumParameters = ARRAYSIZE(rootParams);
		rootSig.pParameters = rootParams;
		rootSig.NumStaticSamplers = ARRAYSIZE(samplers);
		rootSig.pStaticSamplers = samplers;
		
		ID3DBlob* serializedRootSig = 0;
		ID3DBlob* errors = 0;

		D3D12SerializeRootSignature(&rootSig,D3D_ROOT_SIGNATURE_VERSION_1,&serializedRootSig,&errors);

		// Check for errors during serialization
		if (errors != 0)
		{
			OutputDebugString((wchar_t*)errors->GetBufferPointer());
		}

		// Actually create the root sig
		device->CreateRootSignature(
			0,
			serializedRootSig->GetBufferPointer(),
			serializedRootSig->GetBufferSize(),
			IID_PPV_ARGS(rootSignature.GetAddressOf()));
	}

	// Pipeline state
	{
		// Describe the pipeline state
		D3D12_GRAPHICS_PIPELINE_STATE_DESC psoDesc = {};
		// -- Input assembler related ---
		psoDesc.InputLayout.NumElements = inputElementCount;
		psoDesc.InputLayout.pInputElementDescs = inputElements;
		psoDesc.PrimitiveTopologyType = D3D12_PRIMITIVE_TOPOLOGY_TYPE_TRIANGLE;
		// Root sig
		psoDesc.pRootSignature = rootSignature.Get();
		// -- Shaders (VS/PS) ---
		psoDesc.VS.pShaderBytecode = vertexShaderByteCode->GetBufferPointer();
		psoDesc.VS.BytecodeLength = vertexShaderByteCode->GetBufferSize();
		psoDesc.PS.pShaderBytecode = pixelShaderByteCode->GetBufferPointer();
		psoDesc.PS.BytecodeLength = pixelShaderByteCode->GetBufferSize();
		// -- Render targets ---
		psoDesc.NumRenderTargets = 1;
		psoDesc.RTVFormats[0] = DXGI_FORMAT_R8G8B8A8_UNORM;
		psoDesc.DSVFormat = DXGI_FORMAT_D24_UNORM_S8_UINT;
		psoDesc.SampleDesc.Count = 1;
		psoDesc.SampleDesc.Quality = 0;
		// -- States ---
		psoDesc.RasterizerState.FillMode = D3D12_FILL_MODE_SOLID;
		psoDesc.RasterizerState.CullMode = D3D12_CULL_MODE_BACK;
		psoDesc.RasterizerState.DepthClipEnable = true;
		psoDesc.DepthStencilState.DepthEnable = true;
		psoDesc.DepthStencilState.DepthFunc = D3D12_COMPARISON_FUNC_LESS;
		psoDesc.DepthStencilState.DepthWriteMask = D3D12_DEPTH_WRITE_MASK_ALL;
		psoDesc.BlendState.RenderTarget[0].SrcBlend = D3D12_BLEND_ONE;
		psoDesc.BlendState.RenderTarget[0].DestBlend = D3D12_BLEND_ZERO;
		psoDesc.BlendState.RenderTarget[0].BlendOp = D3D12_BLEND_OP_ADD;
		psoDesc.BlendState.RenderTarget[0].RenderTargetWriteMask = D3D12_COLOR_WRITE_ENABLE_ALL;
		// -- Misc ---
		psoDesc.SampleMask = 0xffffffff;
		// Create the pipe state object
		device->CreateGraphicsPipelineState(&psoDesc,IID_PPV_ARGS(pipelineState.GetAddressOf()));
	}
}


// --------------------------------------------------------
// Handle resizing to match the new window size.
//  - DXCore needs to resize the back buffer
//  - Eventually, we'll want to update our 3D camera
// --------------------------------------------------------
void Game::OnResize()
{
	// Handle base-level DX resize stuff
	DXCore::OnResize();

	RaytracingHelper::GetInstance().ResizeOutputUAV(windowWidth, windowHeight);

	camera->UpdateProjectionMatrix((float)windowWidth / windowHeight);
	
}

// --------------------------------------------------------
// Update your game here - user input, move objects, AI, etc.
// --------------------------------------------------------
void Game::Update(float deltaTime, float totalTime)
{
	camera->Update(deltaTime);
	// Example input checking: Quit if the escape key is pressed
	if (Input::GetInstance().KeyDown(VK_ESCAPE))
		Quit();
	for (int x = 0; x < entities.size(); x++) {
		float entityX = entities[x]->GetTransform()->GetPosition().x;
		float entityY = entities[x]->GetTransform()->GetPosition().y;
		float entityZ = entities[x]->GetTransform()->GetPosition().z;
		if (x == 0) 
		{
			entities[x]->GetTransform()->Rotate(0, deltaTime * 0.5f, 0);
		}
		else if (x == 1) 
		{
			entities[x]->GetTransform()->SetPosition(entityX, entityY += sinf(totalTime)*0.01, entityZ);
		}
		else if (x == 2) 
		{
			entities[x]->GetTransform()->SetPosition(entityX, entityY, entityZ += cosf(totalTime) * 0.01);
		}
		else if (x == 3)
		{
			entities[x]->GetTransform()->SetPosition(entityX += sinf(totalTime) * 0.01, entityY, entityZ += cosf(totalTime) * 0.01);
		}
		else if (x == 4)
		{
			entities[x]->GetTransform()->Rotate(0, 0, -deltaTime * 0.9f);
		}
	}
}

// --------------------------------------------------------
// Clear the screen, redraw everything, present to the user
// --------------------------------------------------------
void Game::Draw(float deltaTime, float totalTime)
{
	DX12Helper::GetInstance().GetDefaultAllocator().Reset();
	commandList->Reset(commandAllocator.Get(),0);
	//DX12Helper::GetInstance().CloseExecuteAndResetCommandList();

	// Update raytracing accel structure
	RaytracingHelper::GetInstance().CreateTopLevelAccelerationStructureForScene(entities);

	// Perform raytrace, including execution of command list
	RaytracingHelper::GetInstance().Raytrace(camera,backBuffers[currentSwapBuffer]);

	bool vsyncNecessary = vsync || !deviceSupportsTearing || isFullscreen;

	swapChain->Present(
				vsyncNecessary ? 1 : 0,
				vsyncNecessary ? 0 : DXGI_PRESENT_ALLOW_TEARING);

	// Figure out which buffer is next
		currentSwapBuffer++;
		if (currentSwapBuffer >= numBackBuffers)
			currentSwapBuffer = 0;
		 
	//// Grab the current back buffer for this frame
	//Microsoft::WRL::ComPtr<ID3D12Resource> currentBackBuffer = backBuffers[currentSwapBuffer];
	//// Clearing the render target
	//{
	//	// Transition the back buffer from present to render target
	//	D3D12_RESOURCE_BARRIER rb = {};
	//	rb.Type = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
	//	rb.Flags = D3D12_RESOURCE_BARRIER_FLAG_NONE;
	//	rb.Transition.pResource = currentBackBuffer.Get();
	//	rb.Transition.StateBefore = D3D12_RESOURCE_STATE_PRESENT;
	//	rb.Transition.StateAfter = D3D12_RESOURCE_STATE_RENDER_TARGET;
	//	rb.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
	//	commandList->ResourceBarrier(1, &rb);

	//	// Background color (Cornflower Blue in this case) for clearing
	//	float color[] = { 0.4f, 0.6f, 0.75f, 1.0f };

	//	// Clear the RTV
	//	commandList->ClearRenderTargetView(
	//		rtvHandles[currentSwapBuffer],
	//		color,
	//		0, 0); // No scissor rectangles

	//	// Clear the depth buffer, too
	//	commandList->ClearDepthStencilView(
	//		dsvHandle,
	//		D3D12_CLEAR_FLAG_DEPTH,
	//		1.0f, // Max depth = 1.0f
	//		0, // Not clearing stencil, but need a value
	//		0, 0); // No scissor rects
	//}

	//// Rendering here!
	//{
	//	// Set overall pipeline state
	//	commandList->SetPipelineState(pipelineState.Get());

	//	// Root sig (must happen before root descriptor table)
	//	commandList->SetGraphicsRootSignature(rootSignature.Get());

	//	DX12Helper& dx12HelperInstance = DX12Helper::GetInstance();
	//	Microsoft::WRL::ComPtr<ID3D12DescriptorHeap> descriptorHeap = dx12HelperInstance.GetCBVSRVDescriptorHeap();
	//	commandList->SetDescriptorHeaps(1, descriptorHeap.GetAddressOf());

	//	// Set up other commands for rendering
	//	commandList->OMSetRenderTargets(1, &rtvHandles[currentSwapBuffer], true, &dsvHandle);
	//	commandList->RSSetViewports(1, &viewport);
	//	commandList->RSSetScissorRects(1, &scissorRect);
	//	commandList->IASetPrimitiveTopology(D3D_PRIMITIVE_TOPOLOGY_TRIANGLELIST);

	//	

	//	for (int x = 0; x < entities.size(); x++) {

	//		std::shared_ptr<Material> currentMaterial = entities[x]->GetMaterial();
	//		VertexShaderExternalData vertexShaderData = {};
	//		commandList->SetPipelineState(currentMaterial->GetPipelineState().Get());
	//		
	//		vertexShaderData.world = entities[x]->GetTransform()->GetWorldMatrix();
	//		vertexShaderData.worldInverseTranspose = entities[x]->GetTransform()->GetWorldInverseTransposeMatrix();
	//		vertexShaderData.view = camera->GetView();
	//		vertexShaderData.projection = camera->GetProjection();
	//		
	//		D3D12_GPU_DESCRIPTOR_HANDLE constantBufferHandleDESC = dx12HelperInstance.FillNextConstantBufferAndGetGPUDescriptorHandle((void*)(&vertexShaderData), sizeof(VertexShaderExternalData));

	//		commandList->SetGraphicsRootDescriptorTable(0, constantBufferHandleDESC);

	//		std::shared_ptr<Mesh> mesh = entities[x]->GetMesh();
	//		D3D12_VERTEX_BUFFER_VIEW vertexBufferView = mesh->GetVertexBufferView();
	//		D3D12_INDEX_BUFFER_VIEW  indexBufferView = mesh->GetIndexBufferView();

	//		commandList->IASetVertexBuffers(0, 1, &vertexBufferView);
	//		commandList->IASetIndexBuffer(&indexBufferView);
	//		

	//		PixelShaderExternalData psData = {};
	//		psData.uvScale = currentMaterial->GetUVScale();
	//		psData.uvOffset = currentMaterial->GetUVOffset();
	//		psData.cameraPosition = camera->GetTransform()->GetPosition();
	//		psData.lightCount = lightCount;
	//		memcpy(psData.lights, &lights[0], sizeof(Light) * MAX_LIGHTS);
	//		// Send this to a chunk of the constant buffer heap
	//		// and grab the GPU handle for it so we can set it for this draw
	//		D3D12_GPU_DESCRIPTOR_HANDLE cbHandlePS = dx12HelperInstance.FillNextConstantBufferAndGetGPUDescriptorHandle((void*)(&psData), sizeof(PixelShaderExternalData));

	//		// Set this constant buffer handle
	//		// Note: This assumes that descriptor table 1 is the
	//		// place to put this particular descriptor. This
	//		// is based on how we set up our root signature.
	//		commandList->SetGraphicsRootDescriptorTable(1, cbHandlePS);
	//		commandList->SetGraphicsRootDescriptorTable(2, currentMaterial->GetFinalGPUHandle());
	//		commandList->DrawIndexedInstanced(mesh->GetIndexCount(), 1, 0, 0, 0);
	//	}

	//}

	//// Present
	//{
	//	// Transition back to present
	//	D3D12_RESOURCE_BARRIER rb = {};
	//	rb.Type = D3D12_RESOURCE_BARRIER_TYPE_TRANSITION;
	//	rb.Flags = D3D12_RESOURCE_BARRIER_FLAG_NONE;
	//	rb.Transition.pResource = currentBackBuffer.Get();
	//	rb.Transition.StateBefore = D3D12_RESOURCE_STATE_RENDER_TARGET;
	//	rb.Transition.StateAfter = D3D12_RESOURCE_STATE_PRESENT;
	//	rb.Transition.Subresource = D3D12_RESOURCE_BARRIER_ALL_SUBRESOURCES;
	//	commandList->ResourceBarrier(1, &rb);

	//	// Must occur BEFORE present
	//	DX12Helper::GetInstance().CloseExecuteAndResetCommandList();

	//	// Present the current back buffer
	//	bool vsyncNecessary = vsync || !deviceSupportsTearing || isFullscreen;
	//	swapChain->Present(
	//		vsyncNecessary ? 1 : 0,
	//		vsyncNecessary ? 0 : DXGI_PRESENT_ALLOW_TEARING);

	//	// Figure out which buffer is next
	//	currentSwapBuffer++;
	//	if (currentSwapBuffer >= numBackBuffers)
	//		currentSwapBuffer = 0;
	//}
}