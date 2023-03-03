Poll Plugin Usage:
   The nodebb-plugin-poll-git in the repository is a plugin that provides a poll function for new posts. It allows poll creators to set options, number of votes per person, and the end date of poll. It allows viewers to vote and provides visualized statistics for poll results.


   To use the plugin:
       1) nodebb needs to be set and built successfully
       2) Add this nodebb-plugin-poll-git into the node_modules file; the name of it should be changed into nodebb-plugin-poll; note that the prefix must be nodebb-plugin-xxx or the plugin cannot be successfully installed. (The nodebb-plugin-poll-git is for git actions when the real poll plug in was being edited and cannot be directly used)
       3) run
           ./nodebb install nodebb-plugin-poll
       4) log in as an admin and activate this poll plugin by the plugin button in the admin dashboard.


Tests:
    1) User test:
        One can try to create an new post and can see that the poll option stays together with other widgets like link/image/emoji if the plugin is successfully installed. 

    2) Automated test:
        The automated tests can be find within nodebb-plugin-poll-git/.eslintrc. What is being tested is in the comments which basically test general functionality of poll plugin and prevent some illegal operations. 
        Some tests are come from the ./eslintrc file of official Nodebb poll plugin, and the remainning are added to prevent some possible unexpected operation. Combining with the user tests, these automated tests should be more than enough to use.

    