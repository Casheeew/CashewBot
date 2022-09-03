// Update or create a new SQL model
async function updateOrCreate (model, where, newItem) {
   const foundItem = await model.findOne({where});
   if (!foundItem) {
        const item = await model.create(newItem)
        return  {item, created: true};
    }
    const item = await model.update(newItem, {where});
    return {item, created: false};
};

// Trim message to get rid of command prefix
const getContent = msg => {
    index = msg.content.indexOf(' ');
    if (index == -1) {
      return false;
    };
    return msg.content.slice(index+1);
  }; 

exports.updateOrCreate = updateOrCreate;
exports.getContent = getContent;