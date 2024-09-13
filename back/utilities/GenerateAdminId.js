const generateId = (role) => {
    const RoleSlice = role.slice(0,3)
    const mainId =  Math.floor(1000 + Math.random() * 9000);

    const userId = RoleSlice+mainId

    return userId
};

module.exports = generateId
