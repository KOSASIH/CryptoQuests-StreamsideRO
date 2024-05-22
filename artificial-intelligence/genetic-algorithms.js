class GeneticAlgorithm {
  constructor (npcConstructor, fitnessFunction, populationSize, mutationRate) {
    this.npcConstructor = npcConstructor
    this.fitnessFunction = fitnessFunction
    this.populationSize = populationSize
    this.mutationRate = mutationRate

    this.population = this.initializePopulation()
  }

  initializePopulation () {
    const population = []
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.npcConstructor())
    }
    return population
  }

  selectParents () {
    const totalFitness = this.population.reduce(
      (sum, npc) => sum + npc.fitness,
      0
    )
    const randomValue = Math.random() * totalFitness
    let currentValue = 0
    const parents = []
    for (let i = 0; i < this.populationSize / 2; i++) {
      while (
        currentValue + this.population[parents.length].fitness <
        randomValue
      ) {
        currentValue += this.population[parents.length].fitness
      }
      parents.push(this.population[parents.length])
    }
    return parents
  }

  crossover (parents) {
    const children = []
    for (let i = 0; i < this.populationSize / 2; i++) {
      const child1 = {}
      const child2 = {}
      const crossoverPoint = Math.floor(
        Math.random() * this.npcConstructor.prototype.genes.length
      )
      for (let j = 0; j < this.npcConstructor.prototype.genes.length; j++) {
        if (j < crossoverPoint) {
          child1[this.npcConstructor.prototype.genes[j]] =
            parents[i * 2][this.npcConstructor.prototype.genes[j]]
          child2[this.npcConstructor.prototype.genes[j]] =
            parents[i * 2 + 1][this.npcConstructor.prototype.genes[j]]
        } else {
          child1[this.npcConstructor.prototype.genes[j]] =
            parents[i * 2 + 1][this.npcConstructor.prototype.genes[j]]
          child2[this.npcConstructor.prototype.genes[j]] =
            parents[i * 2][this.npcConstructor.prototype.genes[j]]
        }
      }
      children.push(new this.npcConstructor(child1))
      children.push(new this.npcConstructor(child2))
    }
    return children
  }

  mutate (children) {
    for (let i = 0; i < children.length; i++) {
      for (const gene in children[i]) {
        if (Math.random() < this.mutationRate) {
          children[i][gene] = Math.random() * 2 - 1
        }
      }
    }
    return children
  }

  updatePopulation () {
    const parents = this.selectParents()
    const children = this.crossover(parents)
    const mutatedChildren = this.mutate(children)
    this.population = mutatedChildren
  }

  run () {
    while (true) {
      this.population.forEach((npc) => npc.updateFitness(this.fitnessFunction))
      this.updatePopulation()
    }
  }
}
