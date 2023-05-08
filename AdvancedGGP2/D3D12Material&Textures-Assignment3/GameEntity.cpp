#include "GameEntity.h"
#include "Transform.h"
GameEntity::GameEntity(shared_ptr<Mesh> mesh)
{
    transform = make_shared<Transform>();
    this->mesh = mesh;
}

shared_ptr<Mesh> GameEntity::GetMesh()
{
    return mesh;
}

shared_ptr<Transform> GameEntity::GetTransform()
{
    return transform;
}

shared_ptr<Material> GameEntity::GetMaterial()
{
    return material;
}

void GameEntity::SetMesh(shared_ptr<Mesh> mesh)
{
    this->mesh = mesh;
}

void GameEntity::SetMaterial(shared_ptr<Material> material)
{
    this->material = material;
}
