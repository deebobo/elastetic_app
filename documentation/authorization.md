# authorization

## general information

Groups link users to resources in order to provide an access level. Each user belongs to 1 or more groups and each resource has 1 or more groups assigned to it. This way, if a user wants to access a resource, he/she first needs to be part of a group that is assigned to that resource. Next, the group determines the level of access that the user will have.

## access levels
The following access levels are supported:
- admin: groups with this access level can perform adminstrative tasks
- edit: allows groups to create/change and delete resources
- view: allows a group to view a resource.
- public: gives resources public access.

## example

As an example:
- suppose there are 4 users:
  - Bert
  - Earnie
  - kermit
  - miss piggy
- with the following groups:
  - sesamie readers (users: Bert & Earnie, access: view)
  - sesamie writers (users: Bert & Earnie, access: edit)
  - muppet readers  (users: Kermit & miss piggy)
  - muppet writers  (users: Kermit & miss piggy)
- With the following resources:
  - muppet data, with the groups muppet writers and sesamie readers
  - sesamie data, with the groups muppet readers and sesamie writers
- then:
  - kermit and miss piggy can edit muppet data, but only view sesamie resources
  - Bert and Earnie can edit sesamie data but only view muppet resources.

## speical groups.
The public group is a special case that only makes sense to create 1 time, since it covers all users, including those that are not logged in. 
All resources that have this group assigned, can be viewed by all people.