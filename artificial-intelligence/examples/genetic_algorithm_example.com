let NPC = function(genes) {
  this.genes = genes;
  this.fitness = 0;

  this.updateFitness = function(fitnessFunction) {
    this.fitness = fitnessFunction(this.genes);
  };
};

let fitnessFunction = function(genes) {
  // Compute fitness based on genes
  return 1 / Math.abs(genes[0] + genes[1]);
};

let ga = new GeneticAlgorithm(NPC, fitnessFunction, 100, 0.01);
ga.run();
