class Utils{

  static generateTreeViewArray(source, childKey, parentKey, parent_id, parent_id_history = []) {

    //if the parent_id is undefined use the parent_id of the first array item
    if (parent_id === undefined)
      parent_id = source[0][parentKey];

    //do we need to order the array by parent_id first?
    let target = source.filter(item => (item[parentKey] === parent_id));

    //add the current parent_id to the array of parent_ids for storing all parent dependencies
    parent_id_history.push(parent_id);

    for (let i = 0; i < target.length; i++){
      target[i].parentIdHistory = parent_id_history;
      target[i].children = Utils.generateTreeViewArray(source, childKey, parentKey, target[i][childKey], parent_id_history.slice());
    }

    return target;
  }

}

module.exports = Utils;
