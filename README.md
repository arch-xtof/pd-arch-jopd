# pd-arch-jopd
## Thought Process
### Programing language
The first challenge of this task was choosing the appropriate programming language and framework. I had three variants on my mind: 
* NodeJS
* Go
* Cobol

Though Cobol would have been a good joke, and I kind of wanted to go with Go, I still decided on NodeJS. After evaluating the task, I found out that the main challenge was transforming one JSON into another. Since JSON stands for JavaScript Object Notation, it was obvious that this task was intended for JavaScript and all other choices were disrespectful towards the abbreviation.

### Backend and Frontend
It was mentioned that I could have used any output type except for stdout. Though this was a bit confusing criteria, I assumed that you didn't want to see the console application. Therefore, I decided to use a browser as an interface for the app. The backend part was clear, but I had to think about the fronted. Since I had to work with an API and my application was also kind of an API, I decided to use Swagger UI.

### Choosing containerisation
My initial plan was to use Kubernetes to look cool, but it appeared that my Amazon free tier server didn't have enough CPUs to create a cluster. Furthermore, it would have been an overkill solution and a waste of time, as I had only 2 containers. Kubernetes was invented to deal with the problem of many containers, and this was not the case for me. Finally, I decided to use Docker along with docker-compose.

### Caching
Since the core task was quite simple and I had a decent amount of time, I decided to implement something that APIs need the most - caching. DuckDuckGo was pretty straightforward and suggested using Redis. Though this seemed like a quick bonus feature, It was the most complicated part since NodeJS tried not to connect at all cost.

### Tests
As an additional feature, I decided to implement unit and integration testing. Though, I have to admit, that it was unwise from my side to do this as the last step. This was a good lesson for me, and I'll always consider it in the future.

## Core Logic
### Application
The application backend is written with somewhat respecting RESTful principles. It has only one endpoint available at `/api/dashboards/:uid`.  

Here is the logic diagram:
