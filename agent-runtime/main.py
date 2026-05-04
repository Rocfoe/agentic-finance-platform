import uuid,time

def run_clone(clone_id):
    rid=str(uuid.uuid4())
    print("start",rid)
    time.sleep(1)
    print("end",rid)
    return {"run_id":rid}

if __name__=='__main__':
    run_clone('test')
