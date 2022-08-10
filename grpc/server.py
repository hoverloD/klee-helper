# from email import contentmanager
import os
import re

from concurrent import futures
import logging

import grpc
import msg_pb2
import msg_pb2_grpc


class KleeHelper(msg_pb2_grpc.KleeHelperServicer):
    def kleeGenerate(self, request, context):
        filePath = request.path
        kPath = request.kleePath
        cPath = request.clangPath
        print(filePath, kPath, cPath)

        # Get bc file name
        path = filePath.split('/')
        fileName = path.pop()
        fileNameWithoutSuffix = fileName.split('.')[0]
        bcFileName = fileNameWithoutSuffix + '.bc'
        # Get folder name
        folderName = ''
        path = path[1:]
        for v in path:
            folderName += '/' + v
        bcFilePath = os.path.join(folderName, bcFileName)
        # Compile c file to bitcode and generate test cases with klee
        print('INFO: compiling {0} to bitcode'.format(filePath))
        if(cPath):
            os.system('{0} -emit-llvm -c -g -O0 -Xclang -disable-O0-optnone {1} -o {2}'.format(cPath, filePath, bcFilePath))
        else:
            os.system('clang -emit-llvm -c -g -O0 -Xclang -disable-O0-optnone {0} -o {1}'.format(filePath, bcFilePath))
        print('INFO: Generating test cases with klee')
        if(kPath):
            os.system('{0} {1}'.format(kPath, bcFilePath))
        else:
            os.system('klee {0}'.format(bcFilePath))
        print('INFO: Generation done\n\n')
        # Get test case number
        testCaseNumber = 0
        kleeOutputDir = os.path.join(folderName, 'klee-last')
        for file in os.listdir(kleeOutputDir):
            if file.endswith('ktest'):
                testCaseNumber += 1

        return msg_pb2.TestCaseNumber(number = testCaseNumber)

    def kleeShowTestCase(self, request, context):
        testCasePath = request.name
        
        print('ktest-tool: writing {0} to output.txt'.format(testCasePath))

        os.system('ktest-tool {0} > output.txt'.format(testCasePath))
        testCaseContent = ''
        with open('output.txt', 'r') as f:
            testCaseContent = f.read()
        return msg_pb2.TestCaseContent(content = testCaseContent)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    msg_pb2_grpc.add_KleeHelperServicer_to_server(KleeHelper(), server)
    server.add_insecure_port('[::]:11451')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
