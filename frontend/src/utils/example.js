const card = [1,2,3,4,5,6,7];
const temp = new Array;


const feedback = (item) => {
    const temp2 = new Array;
    if(temp2.length === temp.length) feedback(item)
    temp2.push(item);
    // feedback(item);
    return temp2;

}


card.map((item, index) => {
    const temp = feedback(item)
})
