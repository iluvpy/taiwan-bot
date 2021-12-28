from bs4 import BeautifulSoup
import requests
import json
import argh
import os
import secrets

SEARCH_URL = "https://www.google.com/search?q={}&tbm=isch" # search image

def getLinks(search: str, json_file: bool = True, output: str = "links"):
    """
        creates a file containing links to images that are associated with your search
    """
    url = SEARCH_URL.format(search)
    print(f"url: {url}")
    print("requesting url...")
    req = requests.get(url)
    if not req.ok:
        print("request failed")
        return
    print("request finished")
    html = req.text
    soup = BeautifulSoup(html, "lxml")
    print("loaded html")
    images = soup.find_all("img")
    image_dict = {}
    for img in images:
        src = img["src"]
        if "https" in src:
            image_dict[secrets.token_hex(16)] = src
    output_filename = os.path.splitext(output)[0] + ".json" if json_file else ".txt"
    with open(output_filename, "w+") as file:
        if json_file:
            json.dump(image_dict, file, indent=True)
        else:
            for key in image_dict:
                file.write(f"{image_dict[key]}\n")
 
def main():
    argh.dispatch_command(getLinks)



if __name__ == "__main__":
    main()