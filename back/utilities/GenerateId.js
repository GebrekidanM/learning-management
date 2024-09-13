const generateId = (yearName,role) => {
    const lastTwoDigits = yearName.slice(-2);
    const RoleSlice = role.slice(0,3)
    const mainId =  Math.floor(1000 + Math.random() * 9000);

    const userId = RoleSlice+mainId+"/"+lastTwoDigits

    return userId
};

module.exports = generateId
