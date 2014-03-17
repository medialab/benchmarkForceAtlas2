Spatialization Test Datasets
============================


## What is in this folder ?

We use networks from different origins for our benchmarks. We selected networks of various sizes between 0 and 100,000 nodes.

* /raw contains the original networks converted to GEXF.
* /gexf_randomized contains the same networks randomized 3 different ways.


## Source of the networks

* The networks in the raw/snap/ folder come from the Stanford Large Network Dataset Collection (SNAP) available [here](http://snap.stanford.edu/data/ "SNAP datasets").

  * raw/snap/facebook/ contains 10 ego networks from Facebook. See [this page](http://snap.stanford.edu/data/egonets-Facebook.html) for more information. Gephi can open the '.edge' files.

  * raw/snap/twitter/ contains 973 ego networks from Twitter. See [this page](http://snap.stanford.edu/data/egonets-Twitter.html) for more information. Gephi can open the '.edge' files. We only used the 10 "biggest" networks, 10 "medium sized" networks, and the 10 "smallest" networks. We used the size in bytes to define the "size" of networks, which is an reasonable approximation of the number of edges in the network (the goal was just to get different profiles of networks).

  * raw/snap/oregon-2/ contains 9 Autonomous systems graphs, representing AS peering information inferred from Oregon route-views. See [this page]http://snap.stanford.edu/data/oregon2.html) for more information. The .txt file can be edited in a .edges file that Gephi can open (just removing the first lines).

  * raw/snap/CA-CondMat.txt is the Arxiv COND-MAT (Condense Matter Physics) collaboration network. More information on [this page](http://snap.stanford.edu/data/ca-CondMat.html). The .txt file can be edited in a .edges file that Gephi can open (just removing the first lines).

  * raw/snap/CA-GrQc.txt is the Arxiv GR-QC (General Relativity and Quantum Cosmology) collaboration network. More information on [this page](http://snap.stanford.edu/data/ca-GrQc.html). The .txt file can be edited in a .edges file that Gephi can open (just removing the first lines).

  * raw/snap/CA-HepPh.txt is the Arxiv HEP-PH (High Energy Physics - Phenomenology) collaboration network. More information on [this page](http://snap.stanford.edu/data/ca-HepPh.html). The .txt file can be edited in a .edges file that Gephi can open (just removing the first lines).

* The networks in the raw/gephi/ folder can be found on the [Gephi wiki](http://wiki.gephi.org/index.php/Datasets). Note that most them come from elsewhere, we specify here the actual source.

  * raw/gephi/karate.gml is the social network of friendships between 34 members of a karate club at a US university in the 1970s. This network is feature in this famous paper: W. W. Zachary, An information flow model for conflict and fission in small groups, Journal of Anthropological Research 33, 452-473 (1977)
  
  * raw/gephi/hero-social-network.gephi is the network of super heroes, constructed by Cesc Rosselló, Ricardo Alberich, and Joe Miro from the University of the Balearic Islands.

  * raw/gephi/celegans.gexf represents the neural network of C. Elegans. Data compiled by D. Watts and S. Strogatz and made available on the web [here](http://cdg.columbia.edu/cdg/datasets). Featured in this famous paper: D. J. Watts and S. H. Strogatz, Nature 393, 440-442 (1998). Original experimental data taken from J. G. White, E. Southgate, J. N. Thompson, and S. Brenner, Phil. Trans. R. Soc. London 314, 1-340 (1986). Note that we removed edge weights.
  
  * raw/gephi/yeast.gexf is the protein-protein interaction network in yeast. Original data can be found [here](http://vlado.fmf.uni-lj.si/pub/networks/data/bio/Yeast/Yeast.htm).

## Properties of the source networks

* raw/gephi/karate.gml - Zachary's karate club social network - 34 nodes - 78 edges - Renamed as: zacharys_karate_club.gexf - Type: Social network

* raw/gephi/hero-social-network.gephi - Marvel super heroes social network (as pictured in the comics) - 10,469 nodes - 178,115 edges - Renamed as: marvel_super_heroes.gexf - Type: Social network

* raw/gephi/celegans.gexf - Neural network of C. Elegans - 306 nodes - 2,345 edges - Renamed as: c_elegans.gexf - Type: Biological network

* raw/gephi/yeast.gexf - Protein-protein interaction network in yeast - 2,361 nodes - 7,182 edges - Renamed as: yeast.gexf - Type: Biological network

* raw/snap/CA-CondMat.txt - Condense Matter collaboration network - 23,133 nodes - 186,936 edges - Renamed as: arxiv_condensed_matter.gexf - Type: Collaboration network

* raw/snap/CA-GrQc.txt - General Relativity collaboration network - 5,242 nodes - 28,980 edges - Renamed as: arxiv_general_relativity.gexf - Type: Collaboration network

* raw/snap/CA-HepPh.txt - High Energy Physics collaboration network - 12,008 nodes - 237,010 edges - Renamed as: arxiv_high_energy_physics.gexf - Type: Collaboration network

* raw/snap/oregon-2/oregon2_010331.txt - Oregon route-views at the date 010331 - 10,900 nodes - 31,181 edges - Renamed as: oregon-2_010331.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010407.txt - Oregon route-views at the date 010407 - 10,981 nodes - 30,856 edges - Renamed as: oregon-2_010407.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010414.txt - Oregon route-views at the date 010414 - 11,019 nodes - 31,762 edges - Renamed as: oregon-2_010414.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010421.txt - Oregon route-views at the date 010421 - 11,080 nodes - 31,539 edges - Renamed as: oregon-2_010421.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010428.txt - Oregon route-views at the date 010428 - 11,113 nodes - 31,435 edges - Renamed as: oregon-2_010428.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010505.txt - Oregon route-views at the date 010505 - 11,157 nodes - 30,944 edges - Renamed as: oregon-2_010505.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010512.txt - Oregon route-views at the date 010512 - 11,260 nodes - 31,304 edges - Renamed as: oregon-2_010512.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010519.txt - Oregon route-views at the date 010519 - 11,375 nodes - 32,288 edges - Renamed as: oregon-2_010519.gexf - Type: Autonomous system

* raw/snap/oregon-2/oregon2_010526.txt - Oregon route-views at the date 010526 - 11,461 nodes - 32,731 edges - Renamed as: oregon-2_010526.gexf - Type: Autonomous system

* raw/snap/facebook/0.edges - Facebook ego network of Anonymous 0 - 333 nodes - 5,038 edges - Renamed as: facebook_ego_0.gexf - Type: Social network

* raw/snap/facebook/107.edges - Facebook ego network of Anonymous 107 - 1,034 nodes - 53,498 edges - Renamed as: facebook_ego_107.gexf - Type: Social network

* raw/snap/facebook/348.edges - Facebook ego network of Anonymous 348 - 224 nodes - 6,384 edges - Renamed as: facebook_ego_348.gexf - Type: Social network

* raw/snap/facebook/414.edges - Facebook ego network of Anonymous 414 - 150 nodes - 3,386 edges - Renamed as: facebook_ego_414.gexf - Type: Social network

* raw/snap/facebook/686.edges - Facebook ego network of Anonymous 686 - 168 nodes - 3,312 edges - Renamed as: facebook_ego_686.gexf - Type: Social network

* raw/snap/facebook/698.edges - Facebook ego network of Anonymous 698 - 61 nodes - 540 edges - Renamed as: facebook_ego_698.gexf - Type: Social network

* raw/snap/facebook/1684.edges - Facebook ego network of Anonymous 1684 - 786 nodes - 28,048 edges - Renamed as: facebook_ego_1684.gexf - Type: Social network

* raw/snap/facebook/1912.edges - Facebook ego network of Anonymous 1912 - 747 nodes - 60,050 edges - Renamed as: facebook_ego_1912.gexf - Type: Social network

* raw/snap/facebook/3437.edges - Facebook ego network of Anonymous 3437 - 534 nodes - 9,626 edges - Renamed as: facebook_ego_3437.gexf - Type: Social network

* raw/snap/facebook/3980.edges - Facebook ego network of Anonymous 3980 - 52 nodes - 292 edges - Renamed as: facebook_ego_3980.gexf - Type: Social network

* raw/snap/twitter/256497288.edges - Twitter ego network of Profile 256497288 - 213 nodes - 17,930 edges - Renamed as: twitter_big_ego_256497288.gexf - Type: Social network

* raw/snap/twitter/314316607.edges - Twitter ego network of Profile 314316607 - 235 nodes - 15,957 edges - Renamed as: twitter_big_ego_314316607.gexf - Type: Social network

* raw/snap/twitter/16987303.edges - Twitter ego network of Profile 16987303 - 193 nodes - 13,538 edges - Renamed as: twitter_big_ego_16987303.gexf - Type: Social network

* raw/snap/twitter/217796457.edges - Twitter ego network of Profile 217796457 - 184 nodes - 12,105 edges - Renamed as: twitter_big_ego_217796457.gexf - Type: Social network

* raw/snap/twitter/307458983.edges - Twitter ego network of Profile 307458983 - 228 nodes - 9,938 edges - Renamed as: twitter_big_ego_307458983.gexf - Type: Social network

* raw/snap/twitter/200214366.edges - Twitter ego network of Profile 200214366 - 183 nodes - 9,451 edges - Renamed as: twitter_big_ego_200214366.gexf - Type: Social network

* raw/snap/twitter/24117694.edges - Twitter ego network of Profile 24117694 - 246 nodes - 9,630 edges - Renamed as: twitter_big_ego_24117694.gexf - Type: Social network

* raw/snap/twitter/248883350.edges - Twitter ego network of Profile 248883350 - 184 nodes - 9,042 edges - Renamed as: twitter_big_ego_248883350.gexf - Type: Social network

* raw/snap/twitter/89826562.edges - Twitter ego network of Profile 89826562 - 216 nodes - 9,715 edges - Renamed as: twitter_big_ego_89826562.gexf - Type: Social network

* raw/snap/twitter/175553601.edges - Twitter ego network of Profile 175553601 - 201 nodes - 8,888 edges - Renamed as: twitter_big_ego_175553601.gexf - Type: Social network

* raw/snap/twitter/21420959.edges - Twitter ego network of Profile 21420959 - 91 nodes - 1,787 edges - Renamed as: twitter_med_ego_21420959.gexf - Type: Social network

* raw/snap/twitter/18481292.edges - Twitter ego network of Profile 18481292 - 77 nodes - 1,732 edges - Renamed as: twitter_med_ego_18481292.gexf - Type: Social network

* raw/snap/twitter/22106463.edges - Twitter ego network of Profile 22106463 - 156 nodes - 1,815 edges - Renamed as: twitter_med_ego_22106463.gexf - Type: Social network

* raw/snap/twitter/9460682.edges - Twitter ego network of Profile 9460682 - 88 nodes - 2,003 edges - Renamed as: twitter_med_ego_9460682.gexf - Type: Social network

* raw/snap/twitter/23503181.edges - Twitter ego network of Profile 23503181 - 101 nodes - 1,824 edges - Renamed as: twitter_med_ego_23503181.gexf - Type: Social network

* raw/snap/twitter/430313102.edges - Twitter ego network of Profile 430313102 - 51 nodes - 1,646 edges - Renamed as: twitter_med_ego_430313102.gexf - Type: Social network

* raw/snap/twitter/26346966.edges - Twitter ego network of Profile 26346966 - 78 nodes - 1,928 edges - Renamed as: twitter_med_ego_26346966.gexf - Type: Social network

* raw/snap/twitter/9254272.edges - Twitter ego network of Profile 9254272 - 155 nodes - 1,779 edges - Renamed as: twitter_med_ego_9254272.gexf - Type: Social network

* raw/snap/twitter/163374693.edges - Twitter ego network of Profile 163374693 - 164 nodes - 1,749 edges - Renamed as: twitter_med_ego_163374693.gexf - Type: Social network

* raw/snap/twitter/19933035.edges - Twitter ego network of Profile 19933035 - 62 nodes - 1,632 edges - Renamed as: twitter_med_ego_19933035.gexf - Type: Social network

* raw/snap/twitter/98801140.edges - Twitter ego network of Profile 98801140 - 5 nodes - 5 edges - Renamed as: twitter_small_ego_98801140.gexf - Type: Social network

* raw/snap/twitter/14711172.edges - Twitter ego network of Profile 14711172 - 6 nodes - 8 edges - Renamed as: twitter_small_ego_14711172.gexf - Type: Social network

* raw/snap/twitter/396721965.edges - Twitter ego network of Profile 396721965 - 9 nodes - 21 edges - Renamed as: twitter_small_ego_396721965.gexf - Type: Social network

* raw/snap/twitter/15053535.edges - Twitter ego network of Profile 15053535 - 18 nodes - 26 edges - Renamed as: twitter_small_ego_15053535.gexf - Type: Social network

* raw/snap/twitter/215328630.edges - Twitter ego network of Profile 215328630 - 10 nodes - 33 edges - Renamed as: twitter_small_ego_215328630.gexf - Type: Social network

* raw/snap/twitter/22252971.edges - Twitter ego network of Profile 22252971 - 23 nodes - 34 edges - Renamed as: twitter_small_ego_22252971.gexf - Type: Social network

* raw/snap/twitter/96545499.edges - Twitter ego network of Profile 96545499 - 13 nodes - 38 edges - Renamed as: twitter_small_ego_96545499.gexf - Type: Social network

* raw/snap/twitter/43858661.edges - Twitter ego network of Profile 43858661 - 11 nodes - 37 edges - Renamed as: twitter_small_ego_43858661.gexf - Type: Social network

* raw/snap/twitter/40777046.edges - Twitter ego network of Profile 40777046 - 25 nodes - 39 edges - Renamed as: twitter_small_ego_40777046.gexf - Type: Social network

* raw/snap/twitter/15924858.edges - Twitter ego network of Profile 15924858 - 10 nodes - 39 edges - Renamed as: twitter_small_ego_15924858.gexf - Type: Social network


## Properties of generated networks

* tree_02_04.gexf - 31 nodes - 30 edges - Generated with Gephi's Complex Generator plug-in - Balanced Tree - Settings: r=2 (degree of the root) and h=4 (height of the tree)

* tree_02_08.gexf - 511 nodes - 510 edges - Generated with Gephi's Complex Generator plug-in - Balanced Tree - Settings: r=2 (degree of the root) and h=8 (height of the tree)

* tree_02_10.gexf - 2,047 nodes - 2,046 edges - Generated with Gephi's Complex Generator plug-in - Balanced Tree - Settings: r=2 (degree of the root) and h=10 (height of the tree)

* tree_03_04.gexf - 121 nodes - 120 edges - Generated with Gephi's Complex Generator plug-in - Balanced Tree - Settings: r=3 (degree of the root) and h=4 (height of the tree)

* tree_03_06.gexf - 1,093 nodes - 1,092 edges - Generated with Gephi's Complex Generator plug-in - Balanced Tree - Settings: r=3 (degree of the root) and h=6 (height of the tree)

* small_world_20_4.gexf - 20 nodes - 40 edges - Generated with Gephi's Complex Generator plug-in - Watts-Strogatz Small World model beta - Settings: N=20 (nodes), K=4 (edge by node) and beta=0.2 (rewiring probability)

* small_world_100_10.gexf - 100 nodes - 500 edges - Generated with Gephi's Complex Generator plug-in - Watts-Strogatz Small World model beta - Settings: N=100 (nodes), K=10 (edge by node) and beta=0.2 (rewiring probability)

* small_world_100_10_more_rewire.gexf - 100 nodes - 500 edges - Generated with Gephi's Complex Generator plug-in - Watts-Strogatz Small World model beta - Settings: N=100 (nodes), K=10 (edge by node) and beta=0.5 (rewiring probability)

* small_world_1000_100.gexf - 1000 nodes - 50000 edges - Generated with Gephi's Complex Generator plug-in - Watts-Strogatz Small World model beta - Settings: N=1000 (nodes), K=100 (edge by node) and beta=0.2 (rewiring probability)

* small_world_1000_100_more_rewire.gexf - 1000 nodes - 50000 edges - Generated with Gephi's Complex Generator plug-in - Watts-Strogatz Small World model beta - Settings: N=1000 (nodes), K=100 (edge by node) and beta=0.5 (rewiring probability)

* random_100_005.gexf - 100 nodes - 260 edges - Generated with Gephi's Complex Generator plug-in - Random network - Settings: N=100 (nodes), p=0.05 (probability of connexion)

* random_1000_005.gexf - 1000 nodes - 25,251 edges - Generated with Gephi's Complex Generator plug-in - Random network - Settings: N=1000 (nodes), p=0.05 (probability of connexion)
