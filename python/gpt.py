from gpt4all import GPT4All
import json
import sys
model = GPT4All("gpt4all-falcon-newbpe-q4_0.gguf")

if len(sys.argv) == 1:
    prompt = "Assume that you are Bob"
else:
    prompt = sys.argv[1]

output = model.generate(prompt, max_tokens=128, temp=0.3)


# Data to be written
result = {
    "input": prompt,
    "output": output,
}
 
# Serializing json
json_object = json.dumps(result, indent=4)
 
# Writing to sample.json
with open("python/gpt_result.json", "w") as outfile:
    outfile.write(json_object)