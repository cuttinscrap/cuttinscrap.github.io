nav='ul'

for f in *.md; do
    nav+='\n   li ${f%.md}'
done

echo $nav