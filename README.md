# Positional Index

### Created by Maham Shakir

Simple UI to enter boolean/proximity queries to retrieve Document IDs with the relevant content. 

Can handle following types of Queries:
- Proximity Queries of the type
  - X Y /k
  **Note: DO NOT use "and" operator with proximity queries**
- Boolean Queries with Precedence
  - (not)X and/or (not)Y ... upto k terms
- Complex Queries - Mixture of Proximity and Boolean

Based on dataset provided by instructor for university assignment

- main.py used for Index Creation
- public/data.json used for Index Storage
- src/App.js (function handleClick()) for Query Processing