<script>
  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }
  
  document.getElementById("age").innerHTML = `Hi, I am ${getAge("20071229")}`
</script>

<a id="age">I am x years old!</a>



<img src="https://github-readme-stats.vercel.app/api?username=godModeD&show_icons=true&theme=github_dark&hide_border=true"/>
