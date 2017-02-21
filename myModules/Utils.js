class Utils{

  static generateTreeViewArray(source, childKey, parentKey, parent_id) {

    //if the parent_id is undefined use the parent_id of the first array item
    if (parent_id === undefined)
      parent_id = source[0][parentKey];

    //do we need to order the array by parent_id first?
    let target = source.filter(item => (item[parentKey] === parent_id));

    if (target.length > 0){
      for (let i = 0; i < target.length; i++){
        target[i].childs = Utils.generateTreeViewArray(source, childKey, parentKey, target[i][childKey]);
      }
    }

    return target;
  }

}

module.exports = Utils;
