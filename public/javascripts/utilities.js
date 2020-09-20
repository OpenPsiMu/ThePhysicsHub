const label_items=document.getElementsByClassName("label-item");
const labels = [];
for(var i = 0; i < label_items.length; i++){
    //console.log(label_items[i].innerHTML);
    if(labels.includes(label_items[i].innerHTML))
        continue;
    else
        labels.push(label_items[i].innerHTML);
}
console.log(labels);
for(var i = 0; i < labels.length; i++){
    console.log(labels[i]);
    var label = document.createElement("span");
    label.innerHTML = labels[i];
    label.className = 
    document.getElementsByClassName("sim-label")[0].appendChild(label);
}


//for(int i = 0; i < labels.length; i++){
//
//}
