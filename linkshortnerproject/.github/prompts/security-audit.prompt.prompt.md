---
name: security-audit.prompt
description: Describe when to use this prompt
agent: ask
---
Perfom a security audit of thie codebase to detect any security velnerabilities in this project.

Output your findings as markdown format tablw with the following columns (ID should start at 1 and auto increment, File Path should be actual link to the file): "ID", "Security" ,
"issue", "File Path", "Line Number", and "Recommendation". 