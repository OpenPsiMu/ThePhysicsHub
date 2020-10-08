/* Adding labels to the sidebar */
const label_items=document.getElementsByClassName("label-item");
const labels = [];
for(var i = 0; i < label_items.length; i++){
    if(labels.includes(label_items[i].innerHTML))
        continue;
    else
        labels.push(label_items[i].innerHTML);
}
for(var i = 0; i < labels.length; i++){
    var label = document.createElement("button");
    label.innerHTML = labels[i];
    label.className =
    document.getElementsByClassName("sim-label")[0].appendChild(label);
}

/* Add show class to all sims */
const sims=document.getElementsByClassName("sim-item");
for(let i = 0; i < sims.length; i++){
    sims[i].classList.add("show");
}

/* Filter the sims with respect to the labels */
const filter_items=document.getElementsByClassName("[object HTMLButtonElement]")
const individual_sim_labels=document.getElementsByClassName("label-item");

for(let i = 0; i < individual_sim_labels.length; i++){
    //console.log(filter_items[i]);
    individual_sim_labels[i].addEventListener("click", function(){

        //console.log(individual_sim_labels[i].innerHTML);
        const sim=document.getElementsByClassName("sim-item");
        this.classList.toggle("active");

        for(let j = 0; j < sim.length; j++){
            const label_values=sim[j].getElementsByClassName("label-item");

            for(let k = 0; k < label_values.length; k++){
                if(individual_sim_labels[i].innerHTML === label_values[k].innerHTML){
                    sim[j].classList.remove("hide");
                    sim[j].classList.add("show");
                    break;
                }
                else{
                    sim[j].classList.remove("show");
                    sim[j].classList.add("hide");
                }

            }
        }

    })
}

for(let i = 0; i < filter_items.length; i++){
    //console.log(filter_items[i]);
    filter_items[i].addEventListener("click", function(){

        //console.log(filter_items[i].innerHTML);
        const sim=document.getElementsByClassName("sim-item");
        this.classList.toggle("active");

        for(let j = 0; j < sim.length; j++){
            const label_values=sim[j].getElementsByClassName("label-item");

            for(let k = 0; k < label_values.length; k++){
                if(filter_items[i].innerHTML === label_values[k].innerHTML){
                    sim[j].classList.remove("hide");
                    sim[j].classList.add("show");
                    break;
                }
                else{
                    sim[j].classList.remove("show");
                    sim[j].classList.add("hide");
                }

            }
        }

    })
}
