#pragma once
#include <memory>
#include "Mesh.h"
#include "Transform.h"

using namespace std;
class GameEntity
{
public:
	GameEntity(shared_ptr<Mesh> mesh);

	shared_ptr<Mesh> GetMesh();
	shared_ptr<Transform> GetTransform();

	void SetMesh(shared_ptr<Mesh> mesh);


private:
	shared_ptr<Mesh> mesh;
	shared_ptr <Transform> transform;
};

