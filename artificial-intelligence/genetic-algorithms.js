class GeneticAlgorithm {
  constructor(npcConstructor, fitnessFunction, populationSize, mutationRate) {
    this.npcConstructor = npcConstructor;
    this.fitnessFunction = fitnessFunction;
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;

    this.population = this.initializePopulation();
  }

  initializePopulation() {
    let population = [];
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.npcConstructor());
    }
    return population;
  }

  selectParents() {
    let totalFitness = this.population.reduce((sum, npc) => sum + npc.fitness, 0);
    let randomValue = Math.random() * totalFitness;
    let currentValue = 0;
    let parents = [];
    for (let i = 0; i < this.populationSize / 2; i++) {
      while (currentValue + this.population[parents.length].fitness < randomValue) {
        currentValue += this.population[parents.length].fitness;
      }
      parents.push(this.population[parents.length]);
    }
    return parents;
  }

  crossover(parents) {
    let children = [];
    for (let i = 0; i < this.populationSize / 2; i++) {
      let child1 = {};
      let child2 = {};
      let crossoverPoint = Math.floor(Math.random() * this.npcConstructor.prototype.genes.length);
      for (let j = 0; j < this.npcConstructor.prototype.genes.length; j++) {
        if (j < crossoverPoint) {
          child1[this.npcConstructor.prototype.genes[j]] = parents[i * 2][this.npcConstructor.prototype.genes[j]];
          child2[this.npcConstructor.prototype.genes[j]] = parents[i * 2 + 1][this.npcConstructor.prototype.genes[j]];
        } else {
          child1[this.npcConstructor.prototype.genes[j]] = parents[i * 2 + 1][this.npcConstructor.prototype.genes[j]];
          child2[this.npcConstructor.prototype.genes[j]] = parents[i * 2][this.npcConstructor.prototype.genes[j]];
        }
      }
      children.push(new this.npcConstructor(child1));
      children.push(new this.npcConstructor(child2));
    }
    return children;
  }

  mutate(children) {
    for (let i = 0; i < children.length; i++) {
      for (let gene in children[i]) {
        if (Math.random() < this.mutationRate) {
          children[i][gene] = Math.random() * 2 - 1;
        }
      }
    }
    return children;
  }

  updatePopulation() {
    let parents = this.selectParents();
    let children = this.crossover(parents);
    let mutatedChildren = this.mutate(children);
    this.population = mutatedChildren;
  }

  run() {
    while (true) {
      this.population.forEach(npc => npc.updateFitness(this.fitnessFunction));
      this.updatePopulation();
    }
  }
}
