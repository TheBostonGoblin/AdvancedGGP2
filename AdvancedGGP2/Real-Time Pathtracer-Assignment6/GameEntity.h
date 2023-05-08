#pragma once
#include <memory>
#include "Mesh.h"
#include "Transform.h"
#include "Material.h"

using namespace std;
class GameEntity
{
public:
	GameEntity(shared_ptr<Mesh> mesh);

	shared_ptr<Mesh> GetMesh();
	shared_ptr<Transform> GetTransform();
	shared_ptr<Material> GetMaterial();

	void SetMesh(shared_ptr<Mesh> mesh);
	void SetMaterial(shared_ptr<Material> material);


private:
	shared_ptr<Mesh> mesh;
	shared_ptr <Transform> transform;
	shared_ptr<Material> material;
};

