/* Github Avatar */

/* General infos */
var languages = [];
var stars = 0;
var username = "";

function getUserInfos() {
  if (document.getElementById('github-username').value === "") {
    username = "MynahMarie";
  } else {
    username = document.getElementById('github-username').value;
  }

  fetch('https://api.github.com/users/' + username)
    .then(function(response) {
      if (response.status == 404) {
        resetInfos();
        document.getElementById('github-user-handle').textContent = "Username Not Found";
        throw new Error("User Not Found");
      }
      return response.json();
    })
    .then(function(data) {
      document.getElementById('github-user-handle').textContent = data.name;
      document.getElementById('github-user-link').href = data.html_url;
      document.getElementById('github-user-avatar').src = data.avatar_url;
      document.getElementById('github-user-repos').textContent = data.public_repos;
    })
    .catch(function(error) {
      console.log(error);
    });

  var topRepo = '';

  fetch('https://api.github.com/users/' + username + '/repos')
    .then(function(response) {
      return response.json();
    })
    .then(function(repos) {
      console.log(topRepo);
      repos.forEach(function(repo) {
        stars += parseInt(repo.stargazers_count);
        languages.push(repo.language);
      })

      document.getElementById('github-repos-stars').textContent = stars.toString();
      var uniqueLangs = Array.from(new Set(languages)).filter(function(el) { return el != null });
      document.getElementById('github-repos-languages').textContent = uniqueLangs.join(', ');
      topRepo = repos[0].name;

      /* Infos on specific repo */
      fetch('https://api.github.com/repos/' + username + '/' + topRepo)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          document.getElementById('github-repo-link').href = data.url;
          document.getElementById('github-repo-name').textContent = data.name;
          document.getElementById('github-repo-created').textContent = data.created_at.split('T')[0];
          document.getElementById('github-repo-open-issues').textContent = data.open_issues;
          document.getElementById('github-repo-watchers').textContent = data.watchers_count;
        })
        .catch(function(error) {
          console.log(error);
        })

      var contributors = [];

        fetch('https://api.github.com/repos/' + username + '/' + topRepo + '/contributors')
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            data.forEach(function(contributor) {
              contributors.push(contributor.login);
            })
            var contributorsSpan = document.getElementById('github-repo-contributors');
            contributorsSpan.textContent = contributors.filter(function(name) { return name != null }).join(', ');
          })
          .catch(function(error) {
            console.log(error);
          })
    })
    .catch(function(error) {
      console.log(error);
    })
}

function resetInfos() {
  languages = [];
  stars = 0;
  document.getElementById('github-user-handle').textContent = "";
  document.getElementById('github-user-avatar').src = "#";
  document.getElementById('github-user-link').href = "#";
  document.getElementById('github-user-repos').textContent = "";
  document.getElementById('github-repos-stars').textContent = "";
  document.getElementById('github-repos-languages').textContent = "";
  document.getElementById('github-repo-link').href = "";
  document.getElementById('github-repo-name').textContent = "";
  document.getElementById('github-repo-created').textContent = "";
  document.getElementById('github-repo-open-issues').textContent = "";
  document.getElementById('github-repo-watchers').textContent = "";
  document.getElementById('github-repo-contributors').textContent = "";
}

getUserInfos();

document.getElementById('submitBtn').addEventListener('click', function(e) {
  e.preventDefault();
  resetInfos();
  getUserInfos();
});
