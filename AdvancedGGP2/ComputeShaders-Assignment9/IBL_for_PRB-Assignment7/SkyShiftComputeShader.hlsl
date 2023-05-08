
RWTexture2DArray<float4> cubeMap : register(u0);
Texture2D replacementRight		 : register(t0);
Texture2D replacementLeft		 : register(t1);
Texture2D replacementUp			 : register(t2);
Texture2D replacementDown		 : register(t3);
Texture2D replacementFront		 : register(t4);
Texture2D replacementBack		 : register(t5);

Texture2D currentRight			 : register(t6);
Texture2D currentLeft			 : register(t7);
Texture2D currentUp				 : register(t8);
Texture2D currentDown			 : register(t9);
Texture2D currentFront			 : register(t10);
Texture2D currentBack			 : register(t11);

cbuffer skyShiftVar : register(b0) 
{
	float currentInterpolationPercent;
}


[numthreads(8, 8, 1)]
void main( uint3 threadID : SV_DispatchThreadID )
{
	float4 newColor = float4(0, 1, 0, 0);
	float4 newColor2 = float4(1,0,0,0);

	float finalRed = lerp(newColor.r, newColor2.r, currentInterpolationPercent);
	float finalGreen = lerp(newColor.g, newColor2.g, currentInterpolationPercent);
	float finalBlue = lerp(newColor.b, newColor2.b, currentInterpolationPercent);



	float finalRedRight = lerp(currentRight.Load(int3(threadID.xy, 0)).r, replacementRight.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenRight = lerp(currentRight.Load(int3(threadID.xy, 0)).g, replacementRight.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueRight = lerp(currentRight.Load(int3(threadID.xy, 0)).b, replacementRight.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalRight = float4(finalRedRight, finalGreenRight, finalBlueRight,1);

	float finalRedLeft = lerp(currentLeft.Load(int3(threadID.xy, 0)).r, replacementLeft.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenLeft = lerp(currentLeft.Load(int3(threadID.xy, 0)).g, replacementLeft.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueLeft = lerp(currentLeft.Load(int3(threadID.xy, 0)).b, replacementLeft.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalLeft = float4(finalRedLeft, finalGreenLeft, finalBlueLeft, 1);

	float finalRedUp = lerp(currentUp.Load(int3(threadID.xy, 0)).r, replacementUp.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenUp = lerp(currentUp.Load(int3(threadID.xy, 0)).g, replacementUp.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueUp = lerp(currentUp.Load(int3(threadID.xy, 0)).b, replacementUp.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalUp = float4(finalRedUp, finalGreenUp, finalBlueUp, 1);

	float finalRedDown = lerp(currentDown.Load(int3(threadID.xy, 0)).r, replacementDown.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenDown = lerp(currentDown.Load(int3(threadID.xy, 0)).g, replacementDown.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueDown = lerp(currentDown.Load(int3(threadID.xy, 0)).b, replacementDown.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalDown = float4(finalRedDown, finalGreenDown, finalBlueDown, 1);

	float finalRedFront = lerp(currentFront.Load(int3(threadID.xy, 0)).r, replacementFront.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenFront = lerp(currentFront.Load(int3(threadID.xy, 0)).g, replacementFront.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueFront = lerp(currentFront.Load(int3(threadID.xy, 0)).b, replacementFront.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalFront = float4(finalRedFront, finalGreenFront, finalBlueFront, 1);

	float finalRedBack = lerp(currentBack.Load(int3(threadID.xy, 0)).r, replacementBack.Load(int3(threadID.xy, 0)).r, currentInterpolationPercent);
	float finalGreenBack = lerp(currentBack.Load(int3(threadID.xy, 0)).g, replacementBack.Load(int3(threadID.xy, 0)).g, currentInterpolationPercent);
	float finalBlueBack = lerp(currentBack.Load(int3(threadID.xy, 0)).b, replacementBack.Load(int3(threadID.xy, 0)).b, currentInterpolationPercent);

	float4 finalBack = float4(finalRedBack, finalGreenBack, finalBlueBack, 1);

	float4 finalColor = float4(finalRed, finalGreen, finalBlue, 1);
	



	//float4 finalTextureRight = lerp(currentRight, replacementRight, interpoltionSpeed);

	

	cubeMap[uint3(threadID.xy, 0)] = finalRight;
	cubeMap[uint3(threadID.xy, 1)] = finalLeft;
	cubeMap[uint3(threadID.xy, 2)] = finalUp;
	cubeMap[uint3(threadID.xy, 3)] = finalDown;
	cubeMap[uint3(threadID.xy, 4)] = finalFront;
	cubeMap[uint3(threadID.xy, 5)] = finalBack;
}
